"use client";

import React from "react";
import Star from "./star.svg";
import clsx from "clsx";
import { favorite, unfavorite } from "./actions";

export interface FavoriteButtonProps {
  favorited: boolean;
  teamId: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  favorited,
  teamId,
}) => {
  const [optimisticFavorited, optimisticSetFavorited] =
    React.useState(favorited);
  return (
    <button
      onClick={async () => {
        optimisticSetFavorited(!optimisticFavorited);
        if (!optimisticFavorited) {
          await favorite(teamId);
        } else {
          await unfavorite(teamId);
        }
      }}
    >
      <Star
        className={clsx(
          "stroke-yellow-400 transition duration-200 ease-out",
          optimisticFavorited ? "fill-yellow-400" : "fill-background"
        )}
        width={24}
        height={24}
      />
    </button>
  );
};
