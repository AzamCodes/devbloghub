import { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/context/UserContext";
import Footer from "./(dashboard)/_components/Footer";
import Navbar from "./(dashboard)/_components/Navbar";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: {
    default: "DEVBLOG | BLOG",
    template: "DEVBLOG | %s",
  },
  description: "This is Blog Application for Devs.",
};
export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="dark max-w-[1536px] ml-auto mr-auto"
    >
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/ico2.png" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <body className={inter.className}>
        <UserProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
            <Footer />
            <Toaster />
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
