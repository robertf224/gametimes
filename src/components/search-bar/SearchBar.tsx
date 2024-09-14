"use client";

import React from "react";
import search from "./search";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

export const SearchBar: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const { data, error } = useQuery({
    queryKey: ["search", query],
    queryFn: () => search(query),
    enabled: query !== "",
  });

  let results: React.ReactNode;
  if (error) {
    results = <div className="p-5 text-center">{error.message}</div>;
  } else if (data) {
    if (data.length === 0) {
      results = <div className="p-5 text-center">No results</div>;
    } else {
      results = data.map((team) => (
        <Link className="hover:bg-muted" href={`/team/${team.slug}`}>
          <div key={team.id} className="flex items-center gap-2 p-2">
            {team.logo && (
              <Image
                src={team.logo}
                alt={`${team.college} logo`}
                width={30}
                height={30}
              />
            )}

            <div className="overflow-ellipsis">
              {team.college} {team.name}
            </div>
          </div>
        </Link>
      ));
    }
  }
  return (
    <div className="relative group">
      <input
        className="bg-background focus:outline-none px-5 py-2 border-foreground dark:focus:border-blue-300 focus:border-blue-500 rounded-full border"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search..."
      />
      {results && (
        <div className="rounded-lg z-10 min-w-80 max-h-52 absolute border-foreground border bg-background flex flex-col gap-1 mt-2 overflow-y-scroll group-focus-within:visible invisible">
          {results}
        </div>
      )}
    </div>
  );
};
