import { foundryClient } from "@/logic/foundryClient";
import {
  CollegeFootballConference,
  CollegeFootballGame,
  CollegeFootballTeam,
} from "@gametimes/sdk";
import Image from "next/image";
import { Table } from "../table";
import { Osdk } from "@osdk/client";

export interface TeamViewProps {
  team: Osdk<CollegeFootballTeam>;
}

export const TeamView: React.FC<TeamViewProps> = async ({ team }) => {
  const [{ name: conferenceName }, { data: games }] = await Promise.all([
    foundryClient(CollegeFootballConference).fetchOne(team.conferenceId!, {
      $select: ["name"],
    }),
    foundryClient(CollegeFootballGame)
      .where({
        season: 2024,
        $or: [{ homeTeamId: team.id }, { awayTeamId: team.id }],
      })
      .fetchPage({ $orderBy: { scheduledTime: "asc" }, $pageSize: 50 }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4 flex-none">
        {team.logo && (
          <Image
            src={team.logo}
            alt={`${team.college} logo`}
            width={50}
            height={50}
          />
        )}
        <div>
          <h1 className="text-lg">
            {team.college} {team.name}
          </h1>
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
