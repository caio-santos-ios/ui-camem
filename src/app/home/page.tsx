import { Footer } from "@/components/ui/footer/Footer";
import Image from "next/image";
import Link from "next/link";

const pillars = [
  {
    img: "https://camem.org.br/wp-content/themes/fork/assets/img/img-fork-03.svg",
    alt: "Representação",
    title: "Representação estudantil",
    desc: "Defesa de direitos, diálogo com coordenação e instâncias da UEM.",
    year: "desde 1988",
  },
  {
    img: "https://camem.org.br/wp-content/themes/fork/assets/img/img-fork-02.svg",
    alt: "Acolhimento",
    title: "Acolhimento & integração",
    desc: "Ações de bem-estar, recepção e vida acadêmica humanizada.",
    year: "para você",
  },
  {
    img: "https://camem.org.br/wp-content/themes/fork/assets/img/img-fork-01.svg",
    alt: "Formação",
    title: "Formação científica",
    desc: "Promoção de eventos, ligas acadêmicas e iniciação científica.",
    year: "na prática",
  },
];

const highlights = [
  "Edital e calendário do CAMEM",
  "Estatuto e transparência",
  "Guia do calouro",
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden">

      <section className="relative flex flex-col justify-center px-6 py-28 sm:py-36 overflow-hidden">

        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(31,84,75,0.12) 0%, transparent 70%)",
          }}
        />

        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#1f544b]/20 to-transparent" />

        <div className="max-w-4xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1f544b]/20 bg-[#1f544b]/5 text-[#1f544b] dark:text-[#4DBFB5] text-xs font-semibold tracking-wide uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2a8e84] animate-pulse" />
            Universidade Estadual de Maringá · UEM
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1] mb-6">
            Centro Acadêmico de{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#1f544b] dark:text-[#4DBFB5]">
                Medicina
              </span>
              <span
                className="absolute bottom-1 left-0 right-0 h-3 -z-10 opacity-20 rounded"
                style={{ background: "#1f544b" }}
              />
            </span>{" "}
            de Maringá
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Representamos os estudantes de Medicina da UEM desde{" "}
            <strong className="text-gray-700 dark:text-gray-300 font-semibold">1988</strong>,
            promovendo voz, acolhimento e oportunidades para toda a comunidade discente.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/home/sobre"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1f544b] text-white text-sm font-semibold hover:bg-[#174039] active:scale-95 transition-all duration-150 shadow-lg shadow-[#1f544b]/20"
            >
              Conheça o CAMEM
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link
              href="/home/certificados"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:border-[#1f544b] hover:text-[#1f544b] dark:hover:text-[#4DBFB5] hover:bg-[#f2faf9] dark:hover:bg-[#1f544b]/10 active:scale-95 transition-all duration-150"
            >
              Verificar certificado
            </Link>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-16 w-full grid grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
          {[
            { value: "1988", label: "Fundação" },
            { value: "10+",  label: "Ligas acadêmicas" },
            { value: "UEM",  label: "Maringá · PR" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center py-5 bg-white dark:bg-gray-950 gap-0.5">
              <span className="text-xl font-bold text-[#1f544b] dark:text-brand-300">{stat.value}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto">

          <div className="flex items-center gap-3 mb-10">
            <span className="h-px flex-1 bg-linear-to-r from-[#1f544b]/30 to-transparent" />
            <p className="text-xs font-bold uppercase tracking-widest text-[#2a8e84]">
              O que fazemos
            </p>
            <span className="h-px flex-1 bg-linear-to-l from-[#1f544b]/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {pillars.map((pillar, i) => (
              <div
                key={i}
                className="group relative flex flex-col gap-5 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-[#2a8e84] hover:shadow-lg hover:shadow-[#1f544b]/5 dark:hover:border-[#2a8e84]/50 transition-all duration-300"
              >
                <div className="absolute top-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-[#2a8e84]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="w-12 h-12 rounded-xl bg-[#f2faf9] dark:bg-[#1f544b]/10 flex items-center justify-center border border-[#c0e9e4]/50 dark:border-[#1f544b]/30">
                  <Image src={pillar.img} alt={pillar.alt} width={28} height={28} />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5 text-[15px]">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <span className="text-[11px] font-semibold text-[#2a8e84] uppercase tracking-wider">
                  {pillar.year}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-[#f2faf9] dark:bg-[#1f544b]/5 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-start gap-8">

          <div className="shrink-0">
            <p className="text-xs font-bold uppercase tracking-widest text-[#2a8e84] mb-1">
              Destaques rápidos
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Acesse os principais recursos
            </p>
          </div>

          <ul className="flex flex-col gap-2 flex-1">
            {highlights.map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-[#2a8e84] dark:hover:border-[#2a8e84]/50 hover:shadow-sm transition-all duration-200"
                >
                  <span className="w-2 h-2 rounded-full bg-[#2a8e84] shrink-0 group-hover:scale-125 transition-transform" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium group-hover:text-[#1f544b] dark:group-hover:text-brand-300 transition-colors">
                    {item}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto text-gray-300 dark:text-gray-600 group-hover:text-[#2a8e84] group-hover:translate-x-0.5 transition-all">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
}