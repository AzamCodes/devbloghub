import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/context/UserContext";
import Footer from "./(dashboard)/_components/Footer";
import Navbar from "./(dashboard)/_components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "DEVBLOG | BLOG",
    template: "DEVBLOG | %s",
  },
  description: "This is Blog Application for Devs.",
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
      className="max-w-[1536px] ml-auto mr-auto"
    >
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
