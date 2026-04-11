"use client";

import { useModal } from "../../hooks/useModal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import { userLoggerAtom } from "@/jotai/auth/auth.jotai";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { useEffect, useRef } from "react";
import { ResetUserProfile, TUserLogged, TUserProfile } from "@/types/master-data/user.type";
import { getUserLogged } from "@/utils/auth.util";
import { profileModalAtom } from "@/jotai/master-data/profile.jotai";
import { ProfileModalCreate } from "../pages/master-data/profile/ProfileModalCreate";
import { userAtom, userModalUpdatePasswordAtom } from "@/jotai/master-data/user.jotai";
import { UserModalUpdatePassword } from "../pages/master-data/user/UserModalUpdatePassword";

const roleLabel: Record<string, string> = {
  Student:     "Aluno(a)",
  Teacher:     "Professor(a)",
  Coordinator: "Coordenador(a)",
  Director:    "Diretor(a)",
  Manager:     "Gestor(a)",
  Admin:       "Administrador(a)",
};

export default function UserMetaCard() {
  const [_, setLoading]              = useAtom(loadingAtom);
  const [__, setModal]            = useAtom(profileModalAtom);
  const [user, setUser]              = useAtom(userAtom);
  const [___, setModalUpdatePassword] = useAtom(userModalUpdatePasswordAtom);
  const fileInputRef                 = useRef<HTMLInputElement>(null);

  const { register, reset, watch } = useForm<TUserProfile>({
    defaultValues: ResetUserProfile,
  });

  const userLogged: TUserLogged = getUserLogged();

  const getById = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/users/${userLogged.id}`, configApi());
      const result   = data.result.data;
      reset(result);
      setUser(result);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File[]) => {
    const formBody = new FormData();
    formBody.append("id", watch("id")!);
    formBody.append("photo", file[0]);
    try {
      setLoading(true);
      const { status, data } = await api.put(`/users/profile-photo`, formBody, configApi(false));
      const result           = data.result.data;
      localStorage.setItem("telemovviPhoto", result.photo);
      resolveResponse({ status, ...data });
      await getById();
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const normalizeName = (name: string) => name?.slice(0, 1).toUpperCase() ?? "";

  const status  = user?.statusAccess ?? userLogged?.statusAccess ?? "";
  const blocked = user?.blocked      ?? userLogged?.blocked      ?? false;
  const role    = user?.role         ?? userLogged?.role         ?? "";
  const ra      = user?.ra           ?? userLogged?.ra           ?? "";
  const cpf     = user?.cpf          ?? userLogged?.cpf          ?? "";
  const photo   = user?.photo        ?? userLogged?.photo        ?? "";
  const name    = user?.name         ?? userLogged?.name         ?? "";
  const email   = user?.email        ?? userLogged?.email        ?? "";

  useEffect(() => {
    getById();
  }, []);

  return (
    <>
      <div className="p-6 border border-gray-200 rounded-2xl dark:border-gray-800">

        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 flex-1 min-w-0">

            <div className="relative shrink-0 group">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 cursor-pointer ring-2 ring-offset-2 ring-transparent hover:ring-brand-500 dark:ring-offset-gray-900 transition-all"
              >
                {photo ? (
                  <img
                    src={photo}
                    alt="Foto do usuário"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-brand-50 dark:bg-brand-900/20">
                    <span className="text-3xl font-bold text-brand-600 dark:text-brand-400">
                      {normalizeName(name)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) uploadFile(Array.from(files));
                }}
              />
            </div>

            <div className="flex flex-col gap-2 min-w-0 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap justify-center sm:justify-start">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {name}
                </h4>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{email}</p>

              <div className="flex flex-wrap gap-3 justify-center sm:justify-start mt-1">
                {role && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    {roleLabel[role] ?? role}
                  </div>
                )}
                {ra && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                    </svg>
                    RA: {ra}
                  </div>
                )}
                {cpf && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                    </svg>
                    CPF: {cpf}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 shrink-0 self-start sm:self-center">
            <Button size="sm" variant="outline" onClick={() => setModalUpdatePassword(true)}>
              Alterar senha
            </Button>
            <Button size="sm" variant="primary" onClick={() => setModal(true)}>
              Editar
            </Button>
          </div>

        </div>
      </div>

      <ProfileModalCreate />
      <UserModalUpdatePassword />
    </>
  );
}