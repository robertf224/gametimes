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
    description: "Sports schedules.",
};

export const runtime = "edge";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClientEnvironmentProvider>
            <html className="h-full w-full" lang="en">
                <body className={`${font.className} h-full w-full antialiased`}>
                    <NextTopLoader showSpinner={false} />
                    <div className="flex h-full w-full flex-col">
                        <div className="flex flex-none items-center gap-5 border-b px-5 py-5 sm:px-10">
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
