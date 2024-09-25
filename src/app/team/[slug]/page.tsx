import { TeamView } from "@/components/team-view";
import { foundryClient } from "@/logic/foundryClient";
import { CollegeFootballTeam } from "@gametimes/sdk";
import { notFound } from "next/navigation";

export default async function TeamPage({ params }: { params: { slug: string } }) {
    const { data } = await foundryClient(CollegeFootballTeam)
        .where({ slug: { $eq: params.slug } })
        .fetchPage({ $pageSize: 1 });
    const team = data[0];
    if (team === undefined) {
        notFound();
    }
    return (
        <div
            className="h-full px-5 py-5 sm:px-10"
            style={
                team.color
                    ? {
                          backgroundImage: `linear-gradient(to bottom, var(--background), ${team.color})`,
                      }
                    : undefined
            }
        >
            <TeamView team={team} />
        </div>
    );
}
