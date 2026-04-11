import { Footer } from "@/components/ui/footer/Footer";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Sobre | CAMEM" };

export default function SobrePage() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#f2faf9] to-white px-6 py-16 border-b border-gray-200">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#2a8e84] mb-3">Institucional</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">Sobre o CAMEM</h1>
          <p className="text-gray-500 leading-relaxed mb-3">
            O <strong className="text-gray-700">Centro Acadêmico de Medicina de Maringá (CAMEM)</strong> é o órgão máximo de representação discente dos estudantes de Medicina da <strong className="text-gray-700">Universidade Estadual de Maringá (UEM)</strong>.
          </p>
          <p className="text-gray-500 leading-relaxed">
            Somos uma associação civil sem fins lucrativos, formada por estudantes eleitos anualmente por voto direto. Nossa função vai além de uma diretoria: somos um espaço de mobilização, integração e apoio ao estudante.
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <main className="flex-1 px-6 py-12">
        <div className="max-w-2xl mx-auto flex flex-col gap-10">

          <div>
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Nossa trajetória</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Começamos em 1988, junto com o curso de Medicina da UEM, em um contexto de reivindicações para a consolidação do ensino médico em Maringá. Desde então, seguimos firmes na defesa dos estudantes e no fortalecimento da Medicina.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Missão</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Garantir voz, acolhimento e oportunidades para a comunidade discente de Medicina da UEM.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Princípios</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              {["Representatividade", "Ética", "Transparência", "Equidade", "Compromisso com a ciência"].map((p) => (
                <span key={p} className="text-xs font-semibold text-[#1f544b] bg-[#f2faf9] border border-[#c0e9e4] px-3 py-1 rounded-full">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Estrutura</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {["Diretoria eleita (gestão anual)", "Comissões e projetos", "Apoio a turmas e ligas"].map((item) => (
                <div key={item} className="text-sm text-[#1f544b] font-medium bg-[#f2faf9] border border-[#c0e9e4] rounded-xl px-4 py-3">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Transparência</h2>
            <ul className="flex flex-col gap-2">
              {["Estatuto do CAMEM", "Prestação de contas e relatórios de gestão", "Calendário de reuniões abertas"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-[#2a8e84] font-bold text-xs">→</span>
                  {item}
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
