"use client";

import { Footer } from "@/components/ui/footer/Footer";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CertificadosPage() {
  const [keyCertificate, setKeyCertificate] = useState("");
  const router = useRouter();

  const handleVerify = () => {
    if (!keyCertificate.trim()) return;
    router.push(`/certificates-validate/${keyCertificate}`)
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden">

      {/* Hero */}
      <section className="relative px-6 py-20 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(31,84,75,0.10) 0%, transparent 70%)" }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1f544b]/20 to-transparent" />

        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1f544b]/20 bg-[#1f544b]/5 text-[#1f544b] dark:text-[#4DBFB5] text-xs font-semibold tracking-wide uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2a8e84]" />
            Documentos
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight mb-5">
            Verificar{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#1f544b] dark:text-[#4DBFB5]">autenticidade</span>
              <span className="absolute bottom-1 left-0 right-0 h-2.5 -z-10 opacity-20 rounded" style={{ background: "#1f544b" }} />
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
            Valide certificados e outros documentos emitidos pelo CAMEM informando o keyCertificate de validação ou escaneando o QR code impresso no documento.
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <main className="flex-1 px-6 pb-20 border-t border-gray-100 dark:border-gray-800 pt-12">
        <div className="max-w-xl mx-auto flex flex-col gap-5">

          {/* Campo de verificação */}
          <div className="relative p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#2a8e84]/40 to-transparent" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#2a8e84] mb-4">
              Token de validação
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={keyCertificate}
                onChange={(e) => setKeyCertificate(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                placeholder="Cole o código de autenticidade aqui..."
                className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-[#f2faf9] dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-[#1f544b] focus:ring-2 focus:ring-[#1f544b]/10 transition-all"
              />
              <button
                onClick={handleVerify}
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1f544b] text-white text-sm font-semibold hover:bg-[#174039] active:scale-95 transition-all duration-150 shadow-md shadow-[#1f544b]/20 shrink-0"
              >
                Verificar
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Instruções */}
          <div className="p-6 rounded-2xl border border-[#c0e9e4] dark:border-[#1f544b]/30 bg-[#f2faf9] dark:bg-[#1f544b]/5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#2a8e84] mb-4">Instruções</h2>
            <ul className="flex flex-col gap-4">
              <li className="flex gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2a8e84] shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  <strong className="text-gray-700 dark:text-gray-300">Documentos emitidos antes de setembro de 2025:</strong>{" "}
                  devem ser validados pelo QR code impresso no documento. Basta escanear com a câmera do celular para confirmar a autenticidade.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2a8e84] shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  <strong className="text-gray-700 dark:text-gray-300">Demais documentos:</strong>{" "}
                  podem ser validados pelo QR code impresso no documento ou informando o keyCertificate de validação acima.
                </p>
              </li>
            </ul>
          </div>

          {/* Nota de login */}
          <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Para acessar seus certificados, é necessário{" "}
            <a
              href="/home/login"
              className="text-[#1f544b] dark:text-brand-300 font-semibold hover:underline"
            >
              fazer login no site
            </a>
            . Somente usuários cadastrados poderão visualizar e baixar documentos emitidos a partir deste sistema.{" "}
            Em conformidade com a{" "}
            <strong className="text-gray-700 dark:text-gray-300">Lei Geral de Proteção de Dados (LGPD)</strong>, a consulta pública de certificados não está mais disponível.
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}