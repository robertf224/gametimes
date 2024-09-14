import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ClientEnvironmentProvider } from "@/components/client-environment-provider";

export const font = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gametimes",
  // TODO: come up with description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientEnvironmentProvider>
      <html className="w-full h-full" lang="en">
        <body className={`${font.className} antialiased w-full h-full`}>
          {children}
        </body>
      </html>
    </ClientEnvironmentProvider>
  );
}
