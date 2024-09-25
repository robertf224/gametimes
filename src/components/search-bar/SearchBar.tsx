"use client";

import React from "react";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import search from "./search";
import { Osdk } from "@osdk/client";
import { CollegeFootballTeam } from "@gametimes/sdk";
import { useRouter } from "nextjs-toploader/app";
import { useHotkeys } from "react-hotkeys-hook";
import { TeamLogo } from "../team-logo";
import clsx from "clsx";

export const SearchBar: React.FC = () => {
    const [query, setQuery] = React.useState("");
    const { data, error, isFetching } = useQuery({
        queryKey: ["search", query],
        queryFn: () => search(query),
        enabled: query !== "",
        placeholderData: keepPreviousData,
    });

    const router = useRouter();

    const searchRef = React.useRef<HTMLInputElement>(null);
    useHotkeys<HTMLInputElement>(
        ["meta+k", "esc"],
        (event) => {
            if (searchRef.current === document.activeElement) {
                searchRef.current?.blur();
            } else if (event.key !== "esc") {
                searchRef.current?.focus();
            }
        },
        { enableOnFormTags: true }
    );

    let results: React.ReactNode;
    if (error) {
        results = "Something went wrong 😭";
    } else if (!data || query === "") {
        results = "Start typing to search";
    } else if (data.length === 0) {
        results = "No results";
    }

    if (results) {
        results = <div className={clsx("p-5", isFetching && "opacity-50")}>{results}</div>;
    } else {
        results = data!.map((team) => (
            <ComboboxOption
                key={team.id}
                value={team}
                className={clsx(
                    "flex items-center gap-2 p-2 data-[focus]:bg-active",
                    isFetching && "opacity-50"
                )}
            >
                <TeamLogo team={team} size={30} />
                <div className="overflow-ellipsis">
                    {team.college} {team.name}
                </div>
            </ComboboxOption>
        ));
    }

    return (
        <Combobox<Osdk<CollegeFootballTeam>>
            onChange={(team) => {
                if (team) {
                    router.push(`/team/${team.slug}`);
                }
            }}
            onClose={() => setQuery("")}
            immediate
        >
            <ComboboxInput<Osdk<CollegeFootballTeam>>
                ref={searchRef}
                aria-label="Search"
                autoComplete="off"
                placeholder="Search (meta + k)"
                className="w-full rounded-full border border-foreground bg-background px-5 py-2 focus:outline-none sm:w-fit"
                onChange={(event) => setQuery(event.target.value)}
            />
            <ComboboxOptions
                anchor={{
                    to: "bottom start",
                    gap: 8,
                }}
                transition
                className="h-full w-full origin-top rounded-lg border border-foreground bg-background transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 sm:h-fit sm:w-80"
            >
                {results}
            </ComboboxOptions>
        </Combobox>
    );
};
