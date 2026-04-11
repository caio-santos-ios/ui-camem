import type { Metadata } from "next";
import { Navbar } from "@/components/ui/navbar/Navbar";
import "../globals.css";
import { Providers } from "../providers";
import { Loading } from "@/components/loading/Loading";
import { Outfit } from "next/font/google";

export const metadata: Metadata = {
  title: "CAMEM – Centro Acadêmico de Medicina de Maringá",
  description: "Representamos os estudantes de Medicina da UEM desde 1988.",
};

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {children}
    </div>
  );
}
