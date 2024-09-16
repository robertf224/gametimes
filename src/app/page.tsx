import { CollegeFootballDivision, GametimesFavorite } from "@gametimes/sdk";
import { foundryClient } from "@/logic/foundryClient";
import { Temporal } from "@js-temporal/polyfill";
import { Table } from "@/components/table";
import { auth } from "@/logic/auth";
import Link from "next/link";
import { TeamLogo } from "@/components/team-logo";

export default async function HomePage() {
  const session = await auth();
  const userId = session?.user?.id;
  const fbsTeamsObjectSet = foundryClient(CollegeFootballDivision)
    .where({ alias: "FBS" })
    .pivotTo("collegeFootballConferences")
    .pivotTo("collegeFootballTeams");
  const fbsGamesObjectSet = fbsTeamsObjectSet
    .pivotTo("collegeFootballGames")
    .union(fbsTeamsObjectSet.pivotTo("collegeFootballGames_1"));
  const [{ data: games }, favorites] = await Promise.all([
    fbsGamesObjectSet
      .where({
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
      })
      .fetchPage({ $orderBy: { scheduledTime: "asc" } }),
    userId
      ? foundryClient(GametimesFavorite)
          .where({ userId })
          .pivotTo("collegeFootballTeam")
          .fetchPage()
          .then((data) => data.data)
      : [],
  ]);
  return (
    <div className="py-5 px-10 flex flex-col gap-10">
      {favorites.length > 0 && (
        <div className="flex flex-col gap-5">
          <h2>My favorites</h2>
          <div className="flex flex-wrap gap-5">
            {favorites.map((favorite) => {
              return (
                <Link key={favorite.id} href={`/team/${favorite.slug}`}>
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
}
