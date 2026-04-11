"use client";

import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { api } from "@/service/api.service";
import { TSignIn } from "@/types/auth/signIn.type";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { resolveResponse, saveLocalStorage } from "@/service/config.service";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { useAtom } from "jotai";
import { Logo } from "../logo/Logo";

export default function SignInForm() {
  const [_, setIsLoading] = useAtom(loadingAtom);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit } = useForm<TSignIn>();

  const login: SubmitHandler<TSignIn> = async (body: TSignIn) => {
    try {
      setIsLoading(true);
      const { data } = await api.post(`/auth/login`, body);
      const result = data.result.data;
      saveLocalStorage(result, true);
      router.push("/master-data/profile");
    } catch (error) {
      resolveResponse(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes spin-slow   { to { transform: rotate(360deg); } }
        @keyframes spin-reverse { to { transform: rotate(-360deg); } }
        @keyframes pulse-ring  { 0%,100% { opacity:.15; transform:scale(1); } 50% { opacity:.35; transform:scale(1.06); } }
        @keyframes float-up    { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-10px); } }
        @keyframes fade-in-up  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .anim-spin-slow    { animation: spin-slow 18s linear infinite; }
        .anim-spin-reverse { animation: spin-reverse 12s linear infinite; }
        .anim-pulse-ring   { animation: pulse-ring 3s ease-in-out infinite; }
        .anim-float        { animation: float-up 4s ease-in-out infinite; }
        .anim-fade-in      { animation: fade-in-up .5s ease-out both; }
        .anim-delay-1 { animation-delay: .1s; }
        .anim-delay-2 { animation-delay: .2s; }
        .anim-delay-3 { animation-delay: .3s; }
        .anim-delay-4 { animation-delay: .45s; }
        .anim-delay-5 { animation-delay: .6s; }
      `}</style>

      <div className="min-h-screen w-full flex flex-col lg:flex-row">

        <div className="hidden lg:flex lg:w-1/2 relative bg-[#1f544b] flex-col justify-between p-12 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 80% at 110% 10%, rgba(42,142,132,0.6) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at -10% 100%, rgba(192,233,228,0.12) 0%, transparent 60%)",
            }}
          />

          <div className="relative z-10">
            <Logo width={140} height={140} />
          </div>

          <div className="relative z-10 flex-1 flex items-center justify-center py-12">
            <div className="relative w-64 h-64 flex items-center justify-center">

              <div className="anim-pulse-ring absolute w-64 h-64 rounded-full border border-white/10" />
              <div className="anim-pulse-ring absolute w-52 h-52 rounded-full border border-white/10" style={{ animationDelay: ".5s" }} />
              <div className="anim-pulse-ring absolute w-40 h-40 rounded-full border border-white/15" style={{ animationDelay: "1s" }} />

              <svg className="anim-spin-slow absolute w-64 h-64 opacity-10" viewBox="0 0 256 256">
                <circle cx="128" cy="128" r="120" fill="none" stroke="white" strokeWidth="1" strokeDasharray="8 12" />
              </svg>
              <svg className="anim-spin-reverse absolute w-48 h-48 opacity-10" viewBox="0 0 256 256">
                <circle cx="128" cy="128" r="120" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 16" />
              </svg>

              {[
                { label: "Eventos",       icon: "📅", deg: 0   },
                { label: "Certificados",  icon: "🎓", deg: 90  },
                { label: "Participantes", icon: "👥", deg: 180 },
                { label: "Relatórios",    icon: "📊", deg: 270 },
              ].map(({ label, icon, deg }) => {
                const rad = (deg * Math.PI) / 180;
                const r = 108;
                const x = 128 + r * Math.sin(rad);
                const y = 128 - r * Math.cos(rad);
                return (
                  <div
                    key={label}
                    className="absolute flex flex-col items-center gap-1"
                    style={{ left: `${(x / 256) * 100}%`, top: `${(y / 256) * 100}%`, transform: "translate(-50%,-50%)" }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-base shadow-lg">
                      {icon}
                    </div>
                    <span className="text-[10px] font-semibold text-white/50 whitespace-nowrap">{label}</span>
                  </div>
                );
              })}

              <div className="anim-float relative z-10 flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                </div>
                <span className="text-xs font-bold text-white/60 tracking-widest uppercase">CAMEM</span>
              </div>

            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              {["Gestão de eventos e certificados", "Controle de participantes e presenças", "Emissão e validação de documentos"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span className="text-sm text-white/70">{item}</span>
                </div>
              ))}
            </div>
            <div className="h-px bg-white/10" />
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white dark:bg-gray-950">

          <div className="flex items-center justify-between px-8 pt-8 lg:hidden">
            <Logo width={120} height={120} />
          </div>

          <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-12">
            <div className="w-full max-w-sm">

              <div className="mb-8">
                <h1 className="anim-fade-in text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1.5">
                  Entrar na conta
                </h1>
                <p className="anim-fade-in anim-delay-1 text-sm text-gray-400 dark:text-gray-500">
                  Digite suas credenciais para continuar.
                </p>
              </div>

              <form onSubmit={handleSubmit(login)} className="flex flex-col gap-4">

                <div className="anim-fade-in anim-delay-2 flex flex-col gap-1.5">
                  <Label title="E-mail" />
                  <input
                    placeholder="seu@email.com"
                    {...register("email")}
                    type="email"
                    className="input-erp-primary input-erp-default"
                  />
                </div>

                <div className="anim-fade-in anim-delay-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label title="Senha" />
                    <Link
                      href="/reset-password"
                      className="text-xs text-[#1f544b] dark:text-brand-300 font-medium hover:underline"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      placeholder="••••••••"
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      className="input-erp-primary input-erp-default"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="anim-fade-in anim-delay-4 group mt-1 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1f544b] text-white text-sm font-semibold hover:bg-[#174039] active:scale-[0.98] transition-all duration-150 shadow-lg shadow-[#1f544b]/20"
                >
                  Entrar
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>

              </form>

              <p className="anim-fade-in anim-delay-5 text-sm text-gray-400 dark:text-gray-600 mt-6">
                Não tem uma conta?{" "}
                <Link href="/signup" className="text-[#1f544b] dark:text-brand-300 font-semibold hover:underline">
                  Cadastre-se
                </Link>
              </p>

            </div>
          </div>

          <div className="px-8 sm:px-16 lg:px-20 pb-8">
            <p className="text-xs text-gray-300 dark:text-gray-700">
              © {new Date().getFullYear()} CAMEM – Centro Acadêmico de Medicina de Maringá
            </p>
          </div>

        </div>
      </div>
    </>
  );
}