import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeRegistry from "../theme/ThemeRegistry";
import { AuthProvider } from "../context/AuthContext";
import Navigation from "../components/Navigation";
import AiChat from "../components/AiChat";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "lovesa",
  description: "Organiza tus metas de relación",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeRegistry>
          <AuthProvider>
            <Navigation />
            {children}
            <AiChat />
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
