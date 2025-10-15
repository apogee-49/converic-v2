
import "../styles/globals.css";
import { type Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

//meta wahrscheinich auch seperieren
export const metadata: Metadata = {
  title: "Converic",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={inter.className} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}