import { Footer } from "@/components/ui/footer/Footer";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Sobre | CAMEM" };

const principios = ["Representatividade", "Ética", "Transparência", "Equidade", "Compromisso com a ciência"];
const estrutura  = ["Diretoria eleita (gestão anual)", "Comissões e projetos", "Apoio a turmas e ligas"];
const transp     = ["Estatuto do CAMEM", "Prestação de contas e relatórios de gestão", "Calendário de reuniões abertas"];

export default function SobrePage() {
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
            Institucional
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight mb-5">
            Sobre o{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#1f544b] dark:text-[#4DBFB5]">CAMEM</span>
              <span className="absolute bottom-1 left-0 right-0 h-2.5 -z-10 opacity-20 rounded" style={{ background: "#1f544b" }} />
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
            O <strong className="text-gray-700 dark:text-gray-300 font-semibold">Centro Acadêmico de Medicina de Maringá (CAMEM)</strong> é o órgão máximo de representação discente dos estudantes de Medicina da{" "}
            <strong className="text-gray-700 dark:text-gray-300 font-semibold">Universidade Estadual de Maringá (UEM)</strong>.
          </p>
          <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
            Somos uma associação civil sem fins lucrativos, formada por estudantes eleitos anualmente por voto direto. Nossa função vai além de uma diretoria: somos um espaço de mobilização, integração e apoio ao estudante.
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <main className="flex-1 px-6 pb-20 border-t border-gray-100 dark:border-gray-800 pt-12">
        <div className="max-w-3xl mx-auto flex flex-col gap-10">

          {/* Trajetória */}
          <div className="group relative p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-[#2a8e84]/50 transition-all">
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#2a8e84]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#2a8e84] mb-3">Nossa trajetória</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Começamos em <strong className="text-gray-700 dark:text-gray-300">1988</strong>, junto com o curso de Medicina da UEM, em um contexto de reivindicações para a consolidação do ensino médico em Maringá. Desde então, seguimos firmes na defesa dos estudantes e no fortalecimento da Medicina.
            </p>
          </div>

          {/* Missão */}
          <div className="group relative p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-[#2a8e84]/50 transition-all">
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#2a8e84]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#2a8e84] mb-3">Missão</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Garantir voz, acolhimento e oportunidades para a comunidade discente de Medicina da UEM.
            </p>
          </div>

          {/* Princípios */}
          <div className="group relative p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-[#2a8e84]/50 transition-all">
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#2a8e84]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#2a8e84] mb-4">Princípios</h2>
            <div className="flex flex-wrap gap-2">
              {principios.map((p) => (
                <span key={p} className="text-xs font-semibold text-[#1f544b] dark:text-[#4DBFB5] bg-[#f2faf9] dark:bg-[#1f544b]/10 border border-[#c0e9e4] dark:border-[#1f544b]/30 px-3 py-1.5 rounded-full">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Estrutura */}
          <div className="group relative p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-[#2a8e84]/50 transition-all">
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#2a8e84]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#2a8e84] mb-4">Estrutura</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {estrutura.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-[#1f544b] dark:text-[#4DBFB5] font-medium bg-[#f2faf9] dark:bg-[#1f544b]/10 border border-[#c0e9e4] dark:border-[#1f544b]/30 rounded-xl px-4 py-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2a8e84] shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Transparência */}
          <div className="group relative p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-[#2a8e84]/50 transition-all">
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#2a8e84]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#2a8e84] mb-4">Transparência</h2>
            <ul className="flex flex-col gap-2">
              {transp.map((item) => (
                <li key={item}>
                  <a href="#" className="group/item flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#f2faf9] dark:bg-[#1f544b]/10 border border-[#c0e9e4] dark:border-[#1f544b]/30 hover:border-[#2a8e84] dark:hover:border-[#2a8e84]/50 hover:shadow-sm transition-all">
                    <span className="text-[#2a8e84] font-bold text-xs group-hover/item:translate-x-0.5 transition-transform">→</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium group-hover/item:text-[#1f544b] dark:group-hover/item:text-[#4DBFB5] transition-colors">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}