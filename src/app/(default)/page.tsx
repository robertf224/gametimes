import { CollegeFootballGame } from "@gametimes/sdk";
import { foundryClient } from "@/logic/foundryClient";
import { Temporal } from "@js-temporal/polyfill";
import { Table } from "@/components/table";

export default async function HomePage() {
  const { data } = await foundryClient(CollegeFootballGame)
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
    .fetchPage({ $orderBy: { scheduledTime: "asc" } });
  return (
    <div className="py-5 px-10">
      <Table
        columns={[
          {
            title: "Title",
            renderCell: (game) => game.title,
          },
          {
            title: "Date",
            renderCell: (game) => new Date(game.scheduledTime!).toDateString(),
          },
          {
            title: "Network",
            renderCell: (game) => game.network,
          },
        ]}
        rows={data}
        getId={(game) => game.id}
      />
    </div>
  );
}
