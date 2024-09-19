import { CollegeFootballDivision, GametimesFavorite } from "@gametimes/sdk";
import { foundryClient } from "@/logic/foundryClient";
import { Temporal } from "@js-temporal/polyfill";
import { Table } from "@/components/table";
import { auth } from "@/logic/auth";
import Link from "next/link";
import { TeamLogo } from "@/components/team-logo";
import React from "react";

export const HomeView: React.FC = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  const fbsTeamsObjectSet = foundryClient(CollegeFootballDivision)
    .where({ alias: "FBS" })
    .pivotTo("collegeFootballConferences")
    .pivotTo("collegeFootballTeams");
  const fbsGamesObjectSet = fbsTeamsObjectSet
    .pivotTo("homeGames")
    .union(fbsTeamsObjectSet.pivotTo("awayGames"));
  const upcomingGamesObjectSet = fbsGamesObjectSet.where({
    $and: [
      {
        scheduledTime: {
          $gt: Temporal.Now.zonedDateTimeISO()
            .subtract({ days: 2 })
            .toString({ smallestUnit: "milliseconds" }),
        },
      },
      {
        scheduledTime: {
          $lt: Temporal.Now.zonedDateTimeISO()
            .add({ days: 7 })
            .toString({ smallestUnit: "milliseconds" }),
        },
      },
    ],
  });
  const [{ data: games }, { data: teams }, favorites] = await Promise.all([
    upcomingGamesObjectSet.fetchPage({ $orderBy: { scheduledTime: "asc" } }),
    upcomingGamesObjectSet
      .pivotTo("homeTeam")
      .union(upcomingGamesObjectSet.pivotTo("awayTeam"))
      .fetchPage(),
    userId
      ? foundryClient(GametimesFavorite)
          .where({ userId })
          .pivotTo("collegeFootballTeam")
          .fetchPage()
          .then((data) => data.data)
      : [],
  ]);
  const teamsById = Object.fromEntries(teams.map((team) => [team.id, team]));

  return (
    <div className="py-5 px-5 sm:px-10 flex flex-col gap-10">
      {favorites.length > 0 && (
        <div className="flex flex-col gap-5">
          <h2>My favorites</h2>
          <div className="flex flex-wrap gap-5">
            {favorites.map((favorite) => {
              return (
                <Link
                  key={favorite.id}
                  href={`/team/${favorite.slug}`}
                  className="w-full sm:w-fit"
                >
                  <div className="flex px-5 py-2 items-center gap-2 border-foreground border rounded hover:bg-hover">
                    <TeamLogo team={favorite} size={50} />
                    <div>
                      {favorite.college} {favorite.name}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex flex-col gap-5">
        <h2>Upcoming games</h2>
        <Table
          columns={[
            {
              title: "Matchup",
              renderCell: (game) => {
                const homeTeam = teamsById[game.homeTeamId!]!;
                const awayTeam = teamsById[game.awayTeamId!]!;
                return (
                  <div className="flex items-center gap-2">
                    <Link href={`/team/${awayTeam.slug}`}>
                      <div className="flex items-center gap-1">
                        <TeamLogo size={30} team={awayTeam} />
                        <span className="hidden sm:block">
                          {awayTeam.college}
                        </span>
                      </div>
                    </Link>
                    <span>@</span>
                    <Link href={`/team/${homeTeam.slug}`}>
                      <div className="flex items-center gap-1">
                        <TeamLogo size={30} team={homeTeam} />
                        <span className="hidden sm:block">
                          {homeTeam.college}
                        </span>
                      </div>
                    </Link>
                  </div>
                );
              },
            },
            {
              title: "Date",
              renderCell: (game) => {
                const scheduled = new Date(game.scheduledTime!);
                const datePart = scheduled.toLocaleDateString(undefined, {
                  month: "numeric",
                  day: "numeric",
                  weekday: "short",
                });
                const timePart = scheduled.toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                });
                return (
                  <div className="flex flex-col">
                    <div>{datePart}</div>
                    <div>{timePart}</div>
                  </div>
                );
              },
            },
            {
              title: "Network",
              renderCell: (game) => game.network,
            },
          ]}
          rows={games}
          getId={(game) => game.id}
        />
      </div>
    </div>
  );
};
