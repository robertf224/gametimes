import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ClientEnvironmentProvider } from "@/components/client-environment-provider";
import Link from "next/link";
import { GametimesLogo, GametimesLogoSmall } from "@/components/gametimes-logo";
import { SearchBar } from "@/components/search-bar";
import { ProfileButton } from "@/components/profile-button";
import NextTopLoader from "nextjs-toploader";

const font = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gametimes",
  description: "What the ESPN website should be.",
};

export const runtime = "edge";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientEnvironmentProvider>
      <html className="w-full h-full" lang="en">
        <body className={`${font.className} antialiased w-full h-full`}>
          <NextTopLoader showSpinner={false} />
          <div className="w-full h-full flex flex-col">
            <div className="flex flex-none py-5 sm:px-10 px-5 border-b items-center gap-5">
              <Link href="/">
                <GametimesLogo className="hidden sm:block" />
                <GametimesLogoSmall className="sm:hidden" />
              </Link>
              <div className="flex-1">
                <SearchBar />
              </div>
              <div className="flex-none">
                <ProfileButton />
              </div>
            </div>
            <main className="flex-1">{children}</main>
          </div>
        </body>
      </html>
    </ClientEnvironmentProvider>
  );
}
