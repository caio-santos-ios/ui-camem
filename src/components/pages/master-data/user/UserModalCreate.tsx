"use client";

import Label from "@/components/form/Label";
import Switch from "@/components/form/Switch";
import Button from "@/components/ui/button/Button";
import ModalV2 from "@/components/ui/modalV2"
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { userAtom, userModalAtom } from "@/jotai/master-data/user.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { ResetUser, TUser } from "@/types/master-data/user.type";
import { TProfileUser } from "@/types/setting/profile-permission.type";
import { maskCPF } from "@/utils/mask.util";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export const UserModalCreate = () => {
    const [modal, setModal] = useAtom(userModalAtom);
    const [user, setUser] = useAtom(userAtom);
    const [_, setLoading] = useAtom(loadingAtom);
    const [profileUsers, setProfileUsers] = useState<TProfileUser[]>([]);
    const [showPassword, setShowPassword] = useState(false);

    const { register, reset, setValue, watch, getValues, formState: { errors }} = useForm<TUser>({
        defaultValues: ResetUser
    });

    const blocked = watch("blocked");

    const closeModal = () => {
        setModal(false);
        setUser(ResetUser);
        reset(ResetUser);
    };

    const confirm = async (body: TUser) => {
        if(!body.id) {
            await create(body);
        } else {
            await update(body);
        };
    } 
        
    const create: SubmitHandler<TUser> = async (body: TUser) => {
        try {
            setLoading(true);
            const {data} = await api.post(`/users`, body, configApi());
            resolveResponse({status: 201, message: data.result.message});
            closeModal();
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };
        
    const update: SubmitHandler<TUser> = async (body: TUser) => {
        try {
            setLoading(true);
            const {data} = await api.put(`/users`, body, configApi());
            resolveResponse({status: 200, message: data.result.message});
            closeModal();
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    const getById = async (id: string) => {
        try {
            setLoading(true);
            const {data} = await api.get(`/users/${id}`, configApi());
            const result = data.result.data;
            reset(result);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };
    
    const loaderProfileUser = async () => {
        try {
            setLoading(true);
            const {data} = await api.get(`/profile-users/select?deleted=false`, configApi());
            const result = data?.result?.data ?? [];
            setProfileUsers(result);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loaderProfileUser();

        if(user.id && modal) {
            getById(user.id);
        };
    }, [user.id, modal]);

    return (
        <ModalV2 isOpen={modal} onClose={closeModal} title="Usuário">
            <form className="flex flex-col p-6">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                    <div className="col-span-6">
                        <Label title="Nome Completo"/>
                        <input placeholder="Nome Completo" {...register("name")} type="text" className="input-erp-primary input-erp-default"/>
                    </div>

                    <div className="col-span-6">
                        <Label title="E-mail"/>
                        <input placeholder="E-mail" {...register("email")} type="email" className="input-erp-primary input-erp-default"/>
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
                    <div className="col-span-6">
                        <Label title="CPF"/>
                        <input placeholder="Seu CPF" onInput={(e: any) => maskCPF(e)} {...register("cpf")} type="text" className="input-erp-primary input-erp-default"/>
                    </div>
                    <div className="col-span-6">
                        <Label title="RA"/>
                        <input placeholder="Seu RA" {...register("ra")} type="text" inputMode="numeric" maxLength={6} className="input-erp-primary input-erp-default"/>
                    </div>
                    <div className="col-span-6">
                        <Label title="Nova Senha"/>
                        <div className="relative">
                            <input placeholder="Sua nova senha" {...register("password")} type={showPassword ? "text" : "password"} className="input-erp-primary input-erp-default"/>
                            <span onClick={() => setShowPassword(!showPassword)} className="absolute z-1 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                                {showPassword ? (
                                <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                                ) : (
                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <Label title="Usuário bloqueado?"/>
                        <Switch key={String(blocked)} label={blocked ? 'Sim' : 'Não'} defaultChecked={blocked} onChange={(e) => setValue("blocked", e)} />
                    </div>
                </div>
                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <Button size="sm" variant="outline" onClick={closeModal}>Cancelar</Button>
                    <Button size="sm" variant="primary" onClick={() => confirm(getValues())}>Confirmar</Button>
                </div>
            </form>
        </ModalV2>    
    )
}