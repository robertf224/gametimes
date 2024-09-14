import { GametimesLogo } from "@/components/gametimes-logo";
import { SearchBar } from "@/components/search-bar";
import Link from "next/link";
import React from "react";

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-none py-5 px-10 border-b items-center gap-10">
        <Link href="/">
          <GametimesLogo />
        </Link>
        <SearchBar />
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
