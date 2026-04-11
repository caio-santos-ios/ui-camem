"use client";

import { Footer } from "@/components/ui/footer/Footer";
import { useState } from "react";

export default function CertificadosPage() {
  const [token, setToken] = useState("");

  const handleVerify = () => {
    if (!token.trim()) return;
    window.open(`https://camem.org.br/certificados/?hash=${token.trim()}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#f2faf9] to-white px-6 py-16 border-b border-gray-200">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#2a8e84] mb-3">Documentos</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Verificar autenticidade de documentos
          </h1>
          <p className="text-gray-500 leading-relaxed">
            Valide certificados e outros documentos emitidos pelo CAMEM informando o token de validação ou escaneando o QR code impresso no documento.
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <main className="flex-1 px-6 py-12">
        <div className="max-w-xl mx-auto flex flex-col gap-6">

          {/* Campo de verificação */}
          <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Token de validação</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                placeholder="Cole o código de autenticidade aqui..."
                className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-gray-200 outline-none focus:border-[#1f544b] focus:ring-2 focus:ring-[#1f544b]/10 transition-all"
              />
              <button
                onClick={handleVerify}
                className="px-5 py-2.5 rounded-lg bg-[#1f544b] text-white text-sm font-semibold hover:bg-[#174039] transition-colors shrink-0"
              >
                Verificar
              </button>
            </div>
          </div>

          {/* Instruções */}
          <div className="border border-gray-200 rounded-xl p-6 bg-[#f2faf9]">
            <p className="text-xs font-bold uppercase tracking-widest text-[#2a8e84] mb-4">Instruções</p>
            <ul className="flex flex-col gap-3">
              <li className="text-sm text-gray-600 leading-relaxed pl-3 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#2a8e84]">
                <strong className="text-gray-700">Documentos emitidos antes de setembro de 2025:</strong>{" "}
                devem ser validados pelo QR code impresso no documento. Basta escanear com a câmera do celular para confirmar a autenticidade.
              </li>
              <li className="text-sm text-gray-600 leading-relaxed pl-3 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#2a8e84]">
                <strong className="text-gray-700">Demais documentos:</strong>{" "}
                podem ser validados pelo QR code impresso no documento ou informando o token de validação acima.
              </li>
            </ul>
          </div>

          {/* Nota de login */}
          <div className="border border-gray-200 rounded-xl p-5 bg-white text-sm text-gray-500 leading-relaxed">
            Para acessar seus certificados, é necessário{" "}
            <a
              href="https://camem.org.br/login/"
              target="_blank"
              rel="noreferrer"
              className="text-[#1f544b] font-semibold hover:underline"
            >
              fazer login no site
            </a>
            . Somente usuários cadastrados poderão visualizar e baixar documentos emitidos a partir deste sistema.{" "}
            Em conformidade com a{" "}
            <strong className="text-gray-700">Lei Geral de Proteção de Dados (LGPD)</strong>, a consulta pública de certificados não está mais disponível.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
