import type { Metadata } from "next";
import { Geist, Cormorant_Garamond } from "next/font/google";
import { headers } from 'next/headers' // added
import './globals.css';
import ContextProvider from '@/context'

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const serif = Cormorant_Garamond({ variable: "--font-serif", subsets: ["latin"], display: "swap", weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "AppKit in Next.js + wagmi",
  description: "AppKit example dApp",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersData = await headers();
  const cookies = headersData.get('cookie');

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${serif.variable}`}>
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  );
}
