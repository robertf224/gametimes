"use server";

import { foundryClient } from "@/logic/foundryClient";
import { CollegeFootballDivision, CollegeFootballTeam } from "@gametimes/sdk";
import { Osdk } from "@osdk/client";

export default async function search(
  query: string
): Promise<Array<Osdk<CollegeFootballTeam>>> {
  const fbsTeamsObjectSet = foundryClient(CollegeFootballDivision)
    .where({ alias: "FBS" })
    .pivotTo("collegeFootballConferences")
    .pivotTo("collegeFootballTeams");
  const results = await fbsTeamsObjectSet
    .where({
      $or: [
        {
          college: { $startsWith: query },
        },
        {
          name: { $startsWith: query },
        },
      ],
    })
    .fetchPage({ $pageSize: 10 });
  // TODO: figure out why we need to do this
  return JSON.parse(JSON.stringify(results.data));
}
