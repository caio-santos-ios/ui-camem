"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo/Logo";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { FiInstagram } from "react-icons/fi";
import { HiArrowRight } from "react-icons/hi";

const links = [
  { label: "Início",       href: "/home" },
  { label: "Sobre",        href: "/home/sobre" },
  { label: "Ligas",        href: "/home/ligas" },
  { label: "Certificados", href: "/home/certificados" },
];

export function Navbar() {
  const pathname  = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (href: string) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      pathname === href
        ? "text-[#1f544b] dark:text-[#4DBFB5] bg-[#f2faf9] dark:bg-[#1f544b]/10"
        : "text-gray-500 dark:text-gray-400 hover:text-[#1f544b] dark:hover:text-[#4DBFB5] hover:bg-[#f2faf9] dark:hover:bg-[#1f544b]/10"
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between gap-4">

          <Link href="/home" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpen(false)}>
            <Logo width={160} height={160} />
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={linkClass(l.href)}>
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
              <FiInstagram size={16} />
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="/signin"
              className="hidden md:inline-flex shrink-0 items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#1f544b] hover:bg-[#174039] active:scale-95 transition-all duration-150 shadow-md shadow-[#1f544b]/20"
            >
              Entrar
              <HiArrowRight size={13} />
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Menu"
            >
              {open ? <RiCloseLine size={22} /> : <RiMenu3Line size={22} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 pt-20" onClick={() => setOpen(false)}>
          <div
            className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div
            className="relative bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-lg px-6 py-4 flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`${linkClass(l.href)} block py-3`}
              >
                {l.label}
              </Link>
            ))}

            <div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />

            <a
              href="https://instagram.com/camem.uem"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#1f544b] dark:hover:text-[#4DBFB5] hover:bg-[#f2faf9] dark:hover:bg-[#1f544b]/10 transition-colors"
            >
              <FiInstagram size={16} />
              Instagram
            </a>

            <a
              href="/signin"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-[#1f544b] hover:bg-[#174039] transition-colors shadow-md shadow-[#1f544b]/20"
            >
              Entrar
              <HiArrowRight size={14} />
            </a>
          </div>
        </div>
      )}
    </>
  );
}