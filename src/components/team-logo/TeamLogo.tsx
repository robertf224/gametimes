import { CollegeFootballTeam } from "@gametimes/sdk";
import { Osdk } from "@osdk/client";
import Image from "next/image";
import React from "react";
import Football from "./football.svg";

export interface TeamLogoProps {
  team: Osdk<CollegeFootballTeam>;
  size: number;
}

export const TeamLogo: React.FC<TeamLogoProps> = ({ team, size }) => {
  const baseProps = {
    alt: `${team.college} logo`,
    width: size,
    height: size,
  };
  const lightClassName = "fill-foreground";
  return (
    <>
      {team.logo ? (
        <Image {...baseProps} src={team.logo} className="dark:hidden" />
      ) : (
        <Football {...baseProps} className="fill-foreground dark:hidden" />
      )}
      {team.darkLogo ? (
        <Image
          {...baseProps}
          src={team.darkLogo!}
          className="hidden dark:block"
        />
      ) : (
        <Football
          {...baseProps}
          className="fill-foreground hidden dark:block"
        />
      )}
    </>
  );
};
