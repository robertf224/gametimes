import { auth, signIn, signOut } from "@/logic/auth";
import React from "react";
import Image from "next/image";
import UserIcon from "./user-icon.svg";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuSection,
  MenuSeparator,
} from "@headlessui/react";
import Link from "next/link";

export const ProfileButton: React.FC = async () => {
  const session = await auth();
  const icon = session?.user?.image ? (
    <Image
      className="rounded-full border-muted border"
      src={session.user.image}
      alt="User icon"
      width={40}
      height={40}
    />
  ) : (
    <UserIcon
      width={40}
      height={40}
      className="fill-foreground border-muted border rounded-full"
    />
  );
  const menuItems = session ? (
    <>
      <MenuSection>
        <MenuItem>
          <Link href="/profile">
            <div className="px-3 py-2 w-full hover:bg-hover">Profile</div>
          </Link>
        </MenuItem>
      </MenuSection>
      <MenuSeparator className="h-px bg-foreground" />
      <MenuSection>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <MenuItem>
            <button
              className="px-3 py-2 w-full text-left hover:bg-hover"
              type="submit"
            >
              Sign out
            </button>
          </MenuItem>
        </form>
      </MenuSection>
    </>
  ) : (
    <MenuSection>
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <MenuItem>
          <button
            className="px-3 py-2 w-full text-left hover:bg-hover"
            type="submit"
          >
            Sign in
          </button>
        </MenuItem>
      </form>
    </MenuSection>
  );

  return (
    <Menu>
      <MenuButton>{icon}</MenuButton>
      <MenuItems
        anchor={{
          gap: 8,
          to: "bottom end",
        }}
        transition
        className="w-52 rounded-lg border border-foreground bg-background origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        {menuItems}
      </MenuItems>
    </Menu>
  );
};
