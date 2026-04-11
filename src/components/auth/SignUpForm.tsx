"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api } from "@/service/api.service";
import { resolveResponse } from "@/service/config.service";
import { ResetSignUp, TSignUp } from "@/types/auth/signUp.type";
import { maskCPF } from "@/utils/mask.util";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Logo } from "../logo/Logo";
import { TProfileUser } from "@/types/setting/profile-permission.type";
import Switch from "../form/Switch";

export default function SignUpForm() {
  const [_, setIsLoading] = useAtom(loadingAtom);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [profileUsers, setProfileUsers] = useState<TProfileUser[]>([]);

  const { register, watch, handleSubmit, reset, setValue } = useForm<TSignUp>({
    defaultValues: ResetSignUp,
  });

  const typeAccess = watch("typeAccess");

  const create: SubmitHandler<TSignUp> = async (body: TSignUp) => {
    try {
      setIsLoading(true);
      const { data } = await api.post(`/auth/register`, body);
      resolveResponse({ status: 201, message: data.result.message });
      setTimeout(() => {
        reset(ResetSignUp);
        setIsChecked(false);
        router.push("confirm-account");
      }, 1000);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loaderProfileUser = async () => {
    try {
      const { data } = await api.get(`/profile-users/select?deleted=false`);
      setProfileUsers(data?.result?.data ?? []);
    } catch (error) {
      resolveResponse(error);
    }
  };

  useEffect(() => {
    setValue("privacyPolicy", isChecked);
  }, [isChecked]);

  useEffect(() => {
    loaderProfileUser();
  }, []);

  return (
    <>
      <style>{`
        @keyframes spin-slow    { to { transform: rotate(360deg); } }
        @keyframes spin-reverse { to { transform: rotate(-360deg); } }
        @keyframes pulse-ring   { 0%,100% { opacity:.15; transform:scale(1); } 50% { opacity:.35; transform:scale(1.06); } }
        @keyframes float-up     { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-10px); } }
        @keyframes fade-in-up   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .anim-spin-slow    { animation: spin-slow 18s linear infinite; }
        .anim-spin-reverse { animation: spin-reverse 12s linear infinite; }
        .anim-pulse-ring   { animation: pulse-ring 3s ease-in-out infinite; }
        .anim-float        { animation: float-up 4s ease-in-out infinite; }
        .anim-fade-in      { animation: fade-in-up .5s ease-out both; }
        .anim-delay-1 { animation-delay:.1s; }
        .anim-delay-2 { animation-delay:.2s; }
        .anim-delay-3 { animation-delay:.3s; }
        .anim-delay-4 { animation-delay:.45s; }
        .anim-delay-5 { animation-delay:.6s; }
        .anim-delay-6 { animation-delay:.75s; }
        .anim-delay-7 { animation-delay:.9s; }
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
                { label: "Cadastro",    icon: "✍️", deg: 0   },
                { label: "Verificação", icon: "✅", deg: 90  },
                { label: "Aprovação",   icon: "🔓", deg: 180 },
                { label: "Acesso",      icon: "🎓", deg: 270 },
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
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <line x1="19" y1="8" x2="19" y2="14"/>
                    <line x1="22" y1="11" x2="16" y2="11"/>
                  </svg>
                </div>
                <span className="text-xs font-bold text-white/60 tracking-widest uppercase">Novo acesso</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              {["Preencha o formulário ao lado", "Confirme seu e-mail com o código enviado", "Aguarde a aprovação de um Coordenador"].map((item) => (
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

        <div className="flex-1 flex flex-col bg-white dark:bg-gray-950 overflow-y-auto">
          <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-12">
            <div className="w-full max-w-sm">

              <div className="mb-8 hidden md:block">
                <h1 className="anim-fade-in text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1.5">
                  Criar conta
                </h1>
                <p className="anim-fade-in anim-delay-1 text-sm text-gray-400 dark:text-gray-500">
                  Preencha os dados abaixo para solicitar acesso ao sistema.
                </p>
              </div>

              <form onSubmit={handleSubmit(create)} className="flex flex-col gap-4">

                <div className="anim-fade-in anim-delay-1 flex flex-col gap-1.5">
                  <Label title="Nome Completo" />
                  <input
                    placeholder="Seu nome completo"
                    {...register("name")}
                    type="text"
                    className="input-erp-primary input-erp-default"
                  />
                </div>

                <div className="anim-fade-in anim-delay-2 flex flex-col gap-1.5">
                  <Label title="E-mail" />
                  <input
                    placeholder="seu@email.com"
                    {...register("email")}
                    type="email"
                    className="input-erp-primary input-erp-default"
                  />
                </div>

                <div className="anim-fade-in anim-delay-2 flex flex-col gap-1.5">
                  <Label title="Vínculo institucional" />
                  <select
                    {...register("profileUserId")}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 text-gray-800"
                  >
                    <option value="">Selecione</option>
                    {profileUsers.map((x) => (
                      <option key={x.id} value={x.id}>{x.name}</option>
                    ))}
                  </select>
                </div>

                <div className="anim-fade-in anim-delay-3 grid grid-cols-6 gap-3">
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <Label title="Documento" />
                    <Switch
                      label={typeAccess ? "CPF" : "RA"}
                      defaultChecked={typeAccess}
                      onChange={(e) => setValue("typeAccess", e)}
                    />
                  </div>
                  <div className="col-span-4 flex flex-col gap-1.5">
                    {typeAccess ? (
                      <>
                        <Label title="CPF" />
                        <input
                          placeholder="000.000.000-00"
                          onInput={(e: any) => maskCPF(e)}
                          {...register("cpf")}
                          type="text"
                          className="input-erp-primary input-erp-default"
                        />
                      </>
                    ) : (
                      <>
                        <Label title="RA" />
                        <input
                          placeholder="Seu RA"
                          {...register("ra")}
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          className="input-erp-primary input-erp-default"
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="anim-fade-in anim-delay-4 flex flex-col gap-1.5">
                  <Label title="Senha" />
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

                <div className="anim-fade-in anim-delay-5 flex items-start gap-3">
                  <Checkbox
                    className="w-5 h-5 mt-0.5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Ao criar uma conta, você concorda com os{" "}
                    <span className="text-gray-800 dark:text-white/90 font-medium">Termos e Condições</span>{" "}
                    e nossa{" "}
                    <span className="text-gray-800 dark:text-white font-medium">Política de Privacidade</span>.
                  </p>
                </div>

                <button
                  type="submit"
                  className="anim-fade-in anim-delay-6 group mt-1 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1f544b] text-white text-sm font-semibold hover:bg-[#174039] active:scale-[0.98] transition-all duration-150 shadow-lg shadow-[#1f544b]/20"
                >
                  Criar conta
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>

              </form>

              <p className="anim-fade-in anim-delay-7 text-sm text-gray-400 dark:text-gray-600 mt-6">
                Já tem uma conta?{" "}
                <Link href="/signin" className="text-[#1f544b] dark:text-brand-300 font-semibold hover:underline">
                  Entrar
                </Link>
              </p>

            </div>
          </div>

          <div className="px-8 sm:px-16 lg:px-20 pb-8 hidden md:block">
            <p className="text-xs text-gray-300 dark:text-gray-700">
              © {new Date().getFullYear()} CAMEM – Centro Acadêmico de Medicina de Maringá
            </p>
          </div>

        </div>
      </div>
    </>
  );
}