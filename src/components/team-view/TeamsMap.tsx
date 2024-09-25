/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CollegeFootballStadium, CollegeFootballTeam } from "@gametimes/sdk";
import { Osdk } from "@osdk/client";
import { Marker, ComposableMap, Geographies, Geography } from "react-simple-maps";

export interface TeamsMapProps {
    teams: Array<{
        team: Osdk<CollegeFootballTeam>;
        stadium: Osdk<CollegeFootballStadium>;
    }>;
}

export const TeamsMap: React.FC<TeamsMapProps> = ({ teams }) => {
    return (
        <ComposableMap projection="geoAlbersUsa">
            <Geographies geography="https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json">
                {({ outline, borders }: any) => (
                    <>
                        <Geography geography={outline} fill="#E9E3DA" />
                        <Geography geography={borders} fill="none" stroke="#FFF" />
                    </>
                )}
            </Geographies>
            {teams.map(({ team, stadium }) => (
                <Marker key={team.id} coordinates={stadium.location?.coordinates as [number, number]}>
                    <image href={team.logo} width={30} height={30} />
                </Marker>
            ))}
        </ComposableMap>
    );
};
