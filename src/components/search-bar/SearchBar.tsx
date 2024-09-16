"use client";

import React from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import search from "./search";
import { Osdk } from "@osdk/client";
import { CollegeFootballTeam } from "@gametimes/sdk";
import { useRouter } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import { TeamLogo } from "../team-logo";
import clsx from "clsx";

export const SearchBar: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const { data, error } = useQuery({
    queryKey: ["search", query],
    queryFn: () => search(query),
    enabled: query !== "",
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
    results = <div className="p-5">Something went wrong 😭</div>;
  } else if (!data) {
    results = <div className="p-5">Start typing to search</div>;
  } else if (data.length === 0) {
    results = <div className="p-5">No results</div>;
  } else {
    results = data.map((team) => (
      <ComboboxOption
        key={team.id}
        value={team}
        className="data-[focus]:bg-active flex items-center gap-2 p-2"
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
        className="bg-background focus:outline-none px-5 py-2 border-foreground rounded-full border"
        onChange={(event) => setQuery(event.target.value)}
      />
      <ComboboxOptions
        anchor={{
          to: "bottom start",
          gap: 8,
        }}
        transition
        className={clsx(
          "origin-top transition duration-200 ease-out border w-80 rounded-lg bg-background border-foreground data-[closed]:scale-95 data-[closed]:opacity-0"
        )}
      >
        {results}
      </ComboboxOptions>
    </Combobox>
  );
};
