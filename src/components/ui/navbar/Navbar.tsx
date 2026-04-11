"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo/Logo";

const links = [
  { label: "Início",       href: "/home" },
  { label: "Sobre",        href: "/home/sobre" },
  { label: "Ligas",        href: "/home/ligas" },
  { label: "Certificados", href: "/home/certificados" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95">
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between gap-4">

        <Link href="/home" className="flex items-center gap-2.5 shrink-0">
          <Logo width={160} height={160} />
        </Link>

        <nav className="flex items-center gap-0.5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === l.href
                  ? "text-[#1f544b] dark:text-[#4DBFB5] bg-[#f2faf9] dark:bg-[#1f544b]/10"
                  : "text-gray-500 dark:text-gray-400 hover:text-[#1f544b] dark:hover:text-[#4DBFB5] hover:bg-[#f2faf9] dark:hover:bg-[#1f544b]/10"
              }`}
            >
              {l.label}
            </Link>
          ))}

          <a
            href="https://instagram.com/camem.uem"
            target="_blank"
            rel="noreferrer"
            title="Instagram"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#1f544b] dark:hover:text-[#4DBFB5] hover:bg-[#f2faf9] dark:hover:bg-[#1f544b]/10 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </a>
        </nav>

        <a
          href="/signin"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#1f544b] hover:bg-[#174039] active:scale-95 transition-all duration-150 shadow-md shadow-[#1f544b]/20"
        >
          Entrar
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </header>
  );
}