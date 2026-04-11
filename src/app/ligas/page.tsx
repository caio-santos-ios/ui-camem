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
    <div className="min-h-screen flex flex-col">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#f2faf9] to-white px-6 py-16 border-b border-gray-200">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#2a8e84] mb-3">Ligas Acadêmicas</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">Ligas ativas</h1>
          <p className="text-gray-500 leading-relaxed">
            As <strong className="text-gray-700">Ligas Acadêmicas</strong> são espaços de aprendizado e prática científica criados pelos próprios estudantes. No CAMEM, incentivamos e apoiamos a participação em ligas, pois acreditamos que elas ampliam a formação médica e estimulam o protagonismo estudantil.
          </p>
        </div>
      </section>

      {/* Grid de ligas */}
      <main className="flex-1 px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {ligas.map((liga) => (
              <a
                key={liga.sigla}
                href={`https://camem.org.br/blog/promotor/${liga.sigla.toLowerCase()}/`}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col gap-2 p-5 rounded-xl border border-gray-200 bg-white hover:border-[#2a8e84] hover:bg-[#f2faf9] transition-all"
              >
                <span className="text-xl font-bold text-[#1f544b]">{liga.sigla}</span>
                <span className="text-sm text-gray-500 leading-snug flex-1">{liga.nome}</span>
                <span className="text-gray-300 group-hover:text-[#2a8e84] transition-colors text-lg mt-1">→</span>
              </a>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
