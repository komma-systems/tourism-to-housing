import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Guide — stays that build the commons",
  description:
    "A curated guide to stays that fund permanently affordable housing. Every star verified on-chain.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Fonts loaded at runtime to avoid build-time fetch. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..900;1,9..144,400..700&family=Source+Sans+3:wght@400;500;600;700&family=Spline+Sans+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
