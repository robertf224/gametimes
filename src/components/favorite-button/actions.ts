"use server";

import { auth } from "@/logic/auth";
import { foundryClient } from "@/logic/foundryClient";
import { generateFavoriteId } from "@/logic/generateFavoriteId";
import { createGametimesFavorite, deleteGametimesFavorite } from "@gametimes/sdk";
import { revalidatePath } from "next/cache";

export async function favorite(teamId: string): Promise<void> {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        return;
    }
    const favoriteId = generateFavoriteId(userId, teamId);
    await foundryClient(createGametimesFavorite).applyAction({
        id: favoriteId,
        userId,
        teamId,
        favoritedAt: new Date().toISOString(),
    });
    revalidatePath("/");
}

export async function unfavorite(teamId: string): Promise<void> {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        return;
    }
    const favoriteId = generateFavoriteId(userId, teamId);
    await foundryClient(deleteGametimesFavorite).applyAction({
        gametimesFavorite: favoriteId,
    });
    revalidatePath("/");
}
