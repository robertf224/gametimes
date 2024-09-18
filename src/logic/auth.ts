import NextAuth from "next-auth";
import { Adapter, AdapterUser } from "next-auth/adapters";
import Google from "next-auth/providers/google";
import {
  createGametimesUser,
  deleteGametimesUser,
  editGametimesUser,
  GametimesUser,
  linkGametimesAccount,
} from "@gametimes/sdk";
import { Osdk } from "@osdk/client";
import { foundryClient } from "./foundryClient";

type GametimesUserData = Pick<
  Osdk<GametimesUser>,
  "id" | "emailVerifiedAt" | "avatarUrl" | "name"
> & { email: string };

function toAdapterUser(user: GametimesUserData): AdapterUser {
  user.email;
  return {
    id: user.id,
    email: user.email!,
    emailVerified: user.emailVerifiedAt ? new Date(user.emailVerifiedAt) : null,
    image: user.avatarUrl,
    name: user.name,
  };
}

function toFoundryUser(user: AdapterUser): GametimesUserData {
  return {
    id: user.id,
    email: user.email,
    emailVerifiedAt: user.emailVerified?.toISOString(),
    avatarUrl: user.image ?? undefined,
    name: user.name ?? undefined,
  };
}

const foundryAdapter: Adapter = {
  createUser: async (user) => {
    await foundryClient(createGametimesUser).applyAction(toFoundryUser(user));
    return user;
  },
  updateUser: async (user) => {
    const foundryUser = await foundryClient(GametimesUser).fetchOne(user.id);
    const patchedUser = {
      gametimesUser: user.id,
      email: user.email ?? foundryUser.email!,
      emailVerifiedAt:
        user.emailVerified?.toISOString() ?? foundryUser.emailVerifiedAt,
      avatarUrl: user.image ?? foundryUser.avatarUrl,
      name: user.name ?? foundryUser.name,
    };
    await foundryClient(editGametimesUser).applyAction(patchedUser);
    return toAdapterUser({
      ...patchedUser,
      id: user.id,
    });
  },
  deleteUser: async (userId) => {
    await foundryClient(deleteGametimesUser).applyAction({
      gametimesUser: userId,
    });
  },
  getUser: async (userId) => {
    const user = await foundryClient(GametimesUser).fetchOneWithErrors(userId);
    return user.value ? toAdapterUser(user.value as GametimesUserData) : null;
  },
  getUserByEmail: async (email) => {
    const user = await foundryClient(GametimesUser)
      .where({ email })
      .fetchPage({ $pageSize: 1 });
    return user.data.length < 1
      ? null
      : toAdapterUser(user.data[0] as GametimesUserData);
  },
  linkAccount: async (account) => {
    await foundryClient(linkGametimesAccount).applyAction({
      gametimesUser: account.userId,
      provider: account.provider,
      providerAccountId: account.providerAccountId,
    });
  },
  getUserByAccount: async (account) => {
    const user = await foundryClient(GametimesUser)
      .where({
        $and: [
          { provider: account.provider },
          { providerAccountId: account.providerAccountId },
        ],
      })
      .fetchPage({ $pageSize: 1 });
    return user.data.length < 1
      ? null
      : toAdapterUser(user.data[0] as GametimesUserData);
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  adapter: foundryAdapter,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  trustHost: true,
});
