import { foundryClient } from "@/logic/foundryClient";
import {
  CollegeFootballConference,
  CollegeFootballGame,
  CollegeFootballTeam,
  GametimesFavorite,
} from "@gametimes/sdk";
import Image from "next/image";
import { Table } from "../table";
import { Osdk } from "@osdk/client";
import { FavoriteButton } from "../favorite-button";
import { auth } from "@/logic/auth";
import { generateFavoriteId } from "@/logic/generateFavoriteId";
import { TeamLogo } from "../team-logo";
export interface TeamViewProps {
  team: Osdk<CollegeFootballTeam>;
}

export const TeamView: React.FC<TeamViewProps> = async ({ team }) => {
  const session = await auth();
  const user = session?.user && session.user.id ? session.user : undefined;
  const [{ name: conferenceName }, { data: games }, favoritedResponse] =
    await Promise.all([
      foundryClient(CollegeFootballConference).fetchOne(team.conferenceId!, {
        $select: ["name"],
      }),
      foundryClient(CollegeFootballGame)
        .where({
          season: 2024,
          $or: [{ homeTeamId: team.id }, { awayTeamId: team.id }],
        })
        .fetchPage({ $orderBy: { scheduledTime: "asc" }, $pageSize: 50 }),
      user
        ? foundryClient(GametimesFavorite).fetchOneWithErrors(
            generateFavoriteId(user.id!, team.id)
          )
        : undefined,
    ]);
  const favorited = favoritedResponse?.value;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4 flex-none">
        <TeamLogo team={team} size={50} />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg">
              {team.college} {team.name}
            </h1>
            {user && (
              <FavoriteButton
                teamId={team.id}
                favorited={favorited !== undefined}
              />
            )}
          </div>
          <h6 className="text-muted">{conferenceName}</h6>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <h2 className="text-lg">Schedule</h2>
        <Table
          columns={[
            {
              title: "Title",
              renderCell: (game) => game.title,
            },
            {
              title: "Date",
              renderCell: (game) =>
                new Date(game.scheduledTime!).toDateString(),
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
