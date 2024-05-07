import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

const Helvetica = localFont({
  src: "../public/fonts/hinted-HelveticaNeue.woff2",
});

export const metadata: Metadata = {
  title: "BNI EA EVENTS | Tickets",
  description: "Buy tickets for BNI EA EVENTS",
  icons: {
    icon: "/favicon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={Helvetica.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
