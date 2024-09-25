import { foundryClient } from "@/logic/foundryClient";
import {
    CollegeFootballConference,
    CollegeFootballGame,
    CollegeFootballTeam,
    GametimesFavorite,
} from "@gametimes/sdk";
import { Table } from "../table";
import { Osdk } from "@osdk/client";
import { FavoriteButton } from "../favorite-button";
import { auth } from "@/logic/auth";
import { generateFavoriteId } from "@/logic/generateFavoriteId";
import { TeamLogo } from "../team-logo";
import Link from "next/link";
import { TeamsMap } from "./TeamsMap";
export interface TeamViewProps {
    team: Osdk<CollegeFootballTeam>;
}

export const TeamView: React.FC<TeamViewProps> = async ({ team }) => {
    const session = await auth();
    const user = session?.user && session.user.id ? session.user : undefined;
    const gamesObjectSet = foundryClient(CollegeFootballGame).where({
        season: 2024,
        $or: [{ homeTeamId: team.id }, { awayTeamId: team.id }],
    });
    const [
        { name: conferenceName },
        { data: games },
        { data: teams },
        { data: stadiums },
        favoritedResponse,
    ] = await Promise.all([
        foundryClient(CollegeFootballConference).fetchOne(team.conferenceId!, {
            $select: ["name"],
        }),
        foundryClient(CollegeFootballGame)
            .where({
                season: 2024,
                $or: [{ homeTeamId: team.id }, { awayTeamId: team.id }],
            })
            .fetchPage({
                $orderBy: { scheduledTime: "asc" },
                $pageSize: 100,
            }),
        gamesObjectSet
            .pivotTo("homeTeam")
            .union(gamesObjectSet.pivotTo("awayTeam"))
            .fetchPage({ $pageSize: 100 }),
        gamesObjectSet
            .pivotTo("homeTeam")
            .union(gamesObjectSet.pivotTo("awayTeam"))
            .pivotTo("collegeFootballStadium")
            .fetchPage({ $pageSize: 100 }),
        user
            ? foundryClient(GametimesFavorite).fetchOneWithErrors(generateFavoriteId(user.id!, team.id))
            : undefined,
    ]);
    const favorited = favoritedResponse?.value;
    const teamsById = Object.fromEntries(teams.map((team) => [team.id, team]));
    const stadiumsById = Object.fromEntries(stadiums.map((stadium) => [stadium.id, stadium]));
    const teamsWithStadiums = teams.map((team) => ({ team, stadium: stadiumsById[team.stadiumId!] }));

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-none items-center gap-4">
                <TeamLogo team={team} size={50} />
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg">
                            {team.college} {team.name}
                        </h1>
                        {user && <FavoriteButton teamId={team.id} favorited={favorited !== undefined} />}
                    </div>
                    <h6 className="text-muted">{conferenceName}</h6>
                </div>
            </div>
            <TeamsMap teams={JSON.parse(JSON.stringify(teamsWithStadiums))} />
            <div className="flex flex-1 flex-col gap-2">
                <h2 className="text-lg">Schedule</h2>
                <Table
                    columns={[
                        {
                            title: "Matchup",
                            renderCell: (game) => {
                                const isHomeGame = game.homeTeamId === team.id;
                                const opponentId = isHomeGame ? game.awayTeamId! : game.homeTeamId!;
                                const opponent = teamsById[opponentId]!;
                                return (
                                    <div className="flex items-center gap-1">
                                        <span className="w-5 text-center">{isHomeGame ? "vs" : "@"}</span>
                                        <Link href={`/team/${opponent.slug}`}>
                                            <div className="flex items-center gap-1">
                                                <TeamLogo size={30} team={opponent} />
                                                <span className="hidden sm:block">{opponent.college}</span>
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
                                    <div>
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
