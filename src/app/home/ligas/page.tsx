import { Footer } from "@/components/ui/footer/Footer";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Ligas | CAMEM" };

const ligas = [
  { sigla: "LAC",   nome: "Liga Acadêmica de Cardiologia da UEM" },
  { sigla: "LACIR", nome: "Liga Acadêmica de Cirurgia da UEM" },
  { sigla: "LAD",   nome: "Liga Acadêmica de Dermatologia UEM" },
  { sigla: "LAEC",  nome: "Liga Acadêmica de Emergências Clínicas UEM" },
  { sigla: "LAGO",  nome: "Liga Acadêmica de Ginecologia e Obstetrícia" },
  { sigla: "LAINF", nome: "Liga Acadêmica de Infectologia" },
  { sigla: "LAMI",  nome: "Liga Acadêmica de Medicina Intensiva" },
  { sigla: "LAOFT", nome: "Liga Acadêmica de Oftalmologia" },
  { sigla: "LAONC", nome: "Liga Acadêmica de Oncologia" },
  { sigla: "LAR",   nome: "Liga Acadêmica de Reumatologia" },
];

export default function LigasPage() {
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
            Ligas Acadêmicas
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight mb-5">
            Ligas{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#1f544b] dark:text-[#4DBFB5]">ativas</span>
              <span className="absolute bottom-1 left-0 right-0 h-2.5 -z-10 opacity-20 rounded" style={{ background: "#1f544b" }} />
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
            As <strong className="text-gray-700 dark:text-gray-300 font-semibold">Ligas Acadêmicas</strong> são espaços de aprendizado e prática científica criados pelos próprios estudantes. No CAMEM, incentivamos e apoiamos a participação em ligas, pois acreditamos que elas ampliam a formação médica e estimulam o protagonismo estudantil.
          </p>
        </div>
      </section>

      {/* Grid */}
      <main className="flex-1 px-6 pb-20 border-t border-gray-100 dark:border-gray-800 pt-12">
        <div className="max-w-5xl mx-auto">

          <div className="flex items-center gap-3 mb-8">
            <span className="h-px flex-1 bg-gradient-to-r from-[#1f544b]/30 to-transparent" />
            <p className="text-xs font-bold uppercase tracking-widest text-[#2a8e84]">
              {ligas.length} ligas cadastradas
            </p>
            <span className="h-px flex-1 bg-gradient-to-l from-[#1f544b]/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {ligas.map((liga) => (
              <a
                key={liga.sigla}
                href={`https://camem.org.br/blog/promotor/${liga.sigla.toLowerCase()}/`}
                target="_blank"
                rel="noreferrer"
                className="group relative flex flex-col gap-3 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-[#2a8e84] dark:hover:border-[#2a8e84]/50 hover:shadow-lg hover:shadow-[#1f544b]/5 transition-all duration-300"
              >
                <div className="absolute top-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-[#2a8e84]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start justify-between gap-2">
                  <span className="text-xl font-bold text-[#1f544b] dark:text-[#4DBFB5] leading-none">
                    {liga.sigla}
                  </span>
                  <span className="w-6 h-6 rounded-full bg-[#f2faf9] dark:bg-[#1f544b]/10 flex items-center justify-center shrink-0 border border-[#c0e9e4]/50 dark:border-[#1f544b]/30 group-hover:bg-[#2a8e84] group-hover:border-[#2a8e84] transition-all">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#2a8e84] group-hover:text-white transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <path d="M7 17L17 7M7 7h10v10"/>
                    </svg>
                  </span>
                </div>

                <span className="text-sm text-gray-500 dark:text-gray-400 leading-snug flex-1">
                  {liga.nome}
                </span>
              </a>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}