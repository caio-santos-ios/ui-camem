"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { ResetSignUp, TSignUp } from "@/types/auth/signUp.type";
import { maskCNPJ, maskCPF, maskPhone } from "@/utils/mask.util";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../ui/button/Button";
import { Logo } from "../logo/Logo";
import { TProfileUser } from "@/types/setting/profile-permission.type";
import Switch from "../form/Switch";

export default function SignUpForm() {
  const [_, setIsLoading] = useAtom(loadingAtom);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [profileUsers, setProfileUsers] = useState<TProfileUser[]>([]);

  const { register, watch, handleSubmit, reset, setValue, formState: { errors }} = useForm<TSignUp>({
    defaultValues: ResetSignUp
  });

  const typeAccess = watch("typeAccess");
  
  const create: SubmitHandler<TSignUp> = async (body: TSignUp) => {
    try {
      setIsLoading(true);
      const {data} = await api.post(`/auth/register`, body);
      resolveResponse({status: 201, message: data.result.message});
      
      setTimeout(() => {
        reset(ResetSignUp);
        setIsChecked(false);
        router.push("confirm-account")
      }, 1000);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loaderProfileUser = async () => {
    try {
      const {data} = await api.get(`/profile-users/select?deleted=false`);
      const result = data?.result?.data ?? [];
      setProfileUsers(result);
    } catch (error) {
      resolveResponse(error);
    }
  };

  useEffect(() => {
    setValue("privacyPolicy", isChecked);
  }, [isChecked]);
  
  useEffect(() => {
    const initial = async () => {
      await loaderProfileUser();
    };
    initial();
  }, []);

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full max-w-[90dvw] h-dvh overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto py-4">
        <div className="flex justify-center mb-6">
          <Logo width={250} height={100}/>
        </div>
        <div>
          <form onSubmit={handleSubmit(create)}>
            <div className="grid grid-cols-6 gap-3">
              <div className="col-span-6">
                <Label title="Nome Completo"/>
                <input placeholder="Seu nome completo" {...register("name")} type="text" className="input-erp-primary input-erp-default"/>
              </div>

              <div className="col-span-6">
                <Label title="E-mail"/>
                <input placeholder="Seu e-mail" {...register("email")} type="email" className="input-erp-primary input-erp-default"/>
              </div>

              <div className="col-span-6">
                <Label title="Vínculo institucional"/>
                <select {...register("profileUserId")} className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 text-gray-800">
                  <option value="">Selecione</option>
                  {
                    profileUsers.map(x => <option key={x.id} value={x.id}>{x.name}</option>)
                  }
                </select>
              </div>
              
              <div className="col-span-2">
                <Label title="Tipo de Documento"/>
                <Switch label={typeAccess ? 'CPF' : 'RA'} defaultChecked={typeAccess} onChange={(e) => setValue("typeAccess", e)} />
              </div>
              
              {
                typeAccess ? (
                  <div className="col-span-4">
                    <Label title="CPF"/>
                    <input placeholder="Seu CPF" onInput={(e: any) => maskCPF(e)} {...register("cpf")} type="text" className="input-erp-primary input-erp-default"/>
                  </div>
                ) : (
                  <div className="col-span-4">
                    <Label title="RA"/>
                    <input maxLength={25} placeholder="Seu RA" {...register("ra")} type="text" className="input-erp-primary input-erp-default"/>
                  </div>
                )
              }

              <div className="col-span-6">
                <Label title="Senha"/>
                <div className="relative">
                  <input placeholder="Sua senha" {...register("password")} type={showPassword ? "text" : "password"} className="input-erp-primary input-erp-default"/>
                  <span onClick={() => setShowPassword(!showPassword)} className="absolute z-1 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>

              <div className="col-span-6 flex items-center gap-3">
                <Checkbox
                  className="w-5 h-5"
                  checked={isChecked}
                  onChange={setIsChecked}
                />
                <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                  Ao criar uma conta, você concorda com os termos {" "}
                  <span className="text-gray-800 dark:text-white/90">
                    Termos e Condições,
                  </span>{" "}
                  e nosso{" "}
                  <span className="text-gray-800 dark:text-white">
                    Política de Privacidade
                  </span>
                </p>
              </div>
              <div className="col-span-6">
                <Button type="submit" className="w-full" size="sm">Cadastrar</Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Já tenho uma conta?
              <Link
                href="/"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              > Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
