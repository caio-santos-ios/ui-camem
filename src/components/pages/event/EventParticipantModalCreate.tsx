"use client";

import { DataTableCard } from "@/components/data-table-card/DataTableCard";
import Autocomplete from "@/components/form/Autocomplete";
import Label from "@/components/form/Label";
import { IconDelete } from "@/components/icons/global/iconDelete/IconDelete";
import { IconEdit } from "@/components/icons/global/iconEdit/IconEdit";
import { ModalDelete } from "@/components/modal-delete/ModalDelete";
import { NotData } from "@/components/not-data/NotData";
import Button from "@/components/ui/button/Button";
import ModalV2 from "@/components/ui/modalV2"
import { eventAtom, eventParticipantAtom, eventParticipantModalAtom } from "@/jotai/event/event.jotai";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { modalDeleteAtom } from "@/jotai/global/modal.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { ResetEventParticipant, TEventParticipant, TParticipantFunction } from "@/types/event/event.type";
import { TDataTableColumns } from "@/types/global/data-table-card.type";
import { ResetPagination, TPagination } from "@/types/global/pagination.type";
import { TUser } from "@/types/master-data/user.type";
import { permissionDelete, permissionUpdate } from "@/utils/permission.util";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const columns: TDataTableColumns[] = [
    {title: "Nome no Certificado", label: "name", type: "text"},
    {title: "RA", label: "userRa", type: "text"},
    {title: "CPF", label: "userCpf", type: "text"},
    {title: "Funções", label: "functionName", type: "text"},
    {title: "Horas", label: "hours", type: "text"},
]

const module = "F";
const routine = "F1";

export const EventParticipantModalCreate = () => {
    const [_, setLoading] = useAtom(loadingAtom);
    const [pagination, setPagination] = useState<TPagination>(ResetPagination);
    const [modal, setModal] = useAtom(eventParticipantModalAtom);
    const [event] = useAtom(eventAtom);
    const [eventParticipant, setEventParticipant] = useAtom(eventParticipantAtom);
    const [users, setUsers] = useState<TUser[]>([]);
    const [functions, setFunctions] = useState<TParticipantFunction[]>([]);
    const [modalDelete, setModalDelete] = useAtom(modalDeleteAtom);
    const [autocompleteKey, setAutocompleteKey] = useState(0);
    const abortRef = useRef<AbortController | null>(null);

    const { register, reset, setValue, watch, getValues } = useForm<TEventParticipant>({
        defaultValues: ResetEventParticipant
    });
    
    const userName = watch("userName");

    const closeModal = () => {
        setModal(false);
        setEventParticipant(ResetEventParticipant);
        reset(ResetEventParticipant);
    };

    const clearForm = () => {
        reset({...ResetEventParticipant, eventId: event.id!});
        setEventParticipant(ResetEventParticipant);
    };

    const confirm = async (body: TEventParticipant) => {
        body = {...body, eventId: event.id!};
        if(!body.id) {
            await create(body);
        } else {
            await update(body);
        };
    } 
        
    const create: SubmitHandler<TEventParticipant> = async (body: TEventParticipant) => {
        try {
            setLoading(true);
            const {data} = await api.post(`/event-participants`, body, configApi());
            resolveResponse({status: 201, message: data.result.message});
            await getAll(1);
            
            setValue("id", "");
            setValue("userId", "");
            setValue("userName", "");
            setValue("name", "");
            setValue("functionId", "");
            setValue("hours", 0);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };
    
    const update: SubmitHandler<TEventParticipant> = async (body: TEventParticipant) => {
        try {
            setLoading(true);
            const {data} = await api.put(`/event-participants`, body, configApi());
            resolveResponse({status: 200, message: data.result.message});
            await getAll(1);
            
            setValue("id", "");
            setValue("userId", "");
            setValue("userName", "");
            setValue("name", "");
            setValue("functionId", "");
            setValue("hours", 0);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    const getById = async (id: string) => {
        try {
            setLoading(true);
            const {data} = await api.get(`/event-participants/${id}`, configApi());
            const result = data.result.data;

            reset(result);
            setUsers([]);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    const getAll = async (page: number) => {
        try {
            setLoading(true);
            const {data} = await api.get(`/event-participants?deleted=false&eventId=${event.id}&orderBy=createdAt&sort=desc&pageSize=6&pageNumber=${page}`, configApi());
            const result = data.result.data ?? ResetPagination;
            
            setPagination({
                ...ResetPagination,
                currentPage: result.currentPage,
                data: result.data,
                sizePage: result.pageSize,
                totalPages: result.totalPages,
                totalCount: result.totalCount,
            });
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };
    
    const loadedUsers = async () => {
        try {
            setLoading(true);
            const {data} = await api.get(`/users/select?deleted=false&in$role=Student,Teacher,Director,Coordinator&statusAccess=Aprovado`, configApi());
            const result = data.result.data;
            setUsers(result);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    const loadedFunctions = async (eventId: string) => {
        try {
            setLoading(true);
            const {data} = await api.get(`/event-participant-functions/select?deleted=false&eventId=${eventId}`, configApi());
            const result = data.result.data;
            setFunctions(result);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    const getAutocompleUsers = async (value: string) => {
        try {
            abortRef.current?.abort();
    
            if (!value.trim()) {
                setUsers([]);
                return;
            }
    
            abortRef.current = new AbortController();
    
            const {data} = await api.get(`/users/select?deleted=false&blocked=false&regex$or$name=${value}&in$role=Student,Teacher,Director,Coordinator&statusAccess=Aprovado`, configApi());
            const result = data.result.data ?? [];
            setUsers(result.map((x: any) => ({...x, description: `${x.name} - RA: ${x.ra ? x.ra : "Sem RA"}`})));
        } catch (error) {
            resolveResponse(error);
        }
    };

    const destroy = async () => {
        try {
            setLoading(true);
            await api.delete(`/event-participants/${eventParticipant.id}`, configApi());
            resolveResponse({status: 204, message: "Excluído com sucesso"});
            setModalDelete(false);
            await getAll(1);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    const getObj = async (obj: any, action: string) => {
        setEventParticipant(obj);
        
        if(action == "edit") {
            reset(obj);
            await getById(obj.id);
        } 

        if(action == "delete") setModalDelete(true);
    };

    const changePage = async (page: number) => {
        setPagination(prev => ({
        ...prev,
        currentPage: page
        }));

        await getAll(page);
    };

    useEffect(() => {
        const initial = async () => {
            if(event.id && modal) {
                setValue("eventId", event.id);
                loadedUsers();
                loadedFunctions(event.id);
                getAll(1);
            };
        };
        initial();
    }, [event.id, modal]);

    return (
        <ModalV2 isOpen={modal} onClose={closeModal} title="Participantes" size="xl">
            <form className="flex flex-col p-6">
                <div className="grid grid-cols-8 gap-x-6 gap-y-5 max-h-[calc(100dvh-12rem)]">
                    {
                        event.status == "Rascunho" && (
                            <>
                                <div className="col-span-8 md:col-span-4">
                                    <Label title="Usuário" required={false}/>
                                    <Autocomplete key={autocompleteKey} placeholder="Buscar Usuário..." defaultValue={userName} objKey="id" objValue="description" onSearch={(value: string) => getAutocompleUsers(value)} onSelect={(opt) => {
                                        setValue("userId", opt.id);
                                        setValue("userName", opt.name)
                                        setValue("name", opt.name)
                                        setUsers([]);
                                    }} options={users}/>
                                </div>
                                <div className="col-span-8 md:col-span-4">
                                    <Label title="Nome no Certificado"/>
                                    <input placeholder="Nome no Certificado" {...register("name")} type="text" className="input-erp-primary input-erp-default"/>
                                </div>
                                <div className="col-span-8 md:col-span-4">
                                    <Label title="Função"/>
                                    <select {...register("functionId")} onChange={(e) => {
                                        const id = e.target.value;

                                        if(id) {
                                            const fun = functions.find(x => x.id == id);
                                            if(fun) setValue("hours", fun.hours);
                                        } else {
                                            setValue("hours", 0);
                                        }
                                    }} className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 text-gray-800">
                                        <option value="">Selecione</option>
                                        {
                                            functions.map(x => <option key={x.id} value={x.id}>{x.name}</option>)
                                        }
                                    </select>
                                </div>
                                <div className="col-span-8 md:col-span-2">
                                    <Label title="Horas" required={false}/>
                                    <input {...register("hours", { valueAsNumber: true })} type="number" placeholder="Horas" className="input-erp-primary input-erp-default no-spinner" />
                                </div>
                                <div className="col-span-8 md:col-span-2 flex items-end gap-4">
                                    <Button className="" size="sm" variant="outline" onClick={clearForm}>Cancelar</Button>
                                    <Button className="" size="sm" variant="primary" onClick={() => confirm(getValues())}>Salvar</Button>
                                </div>
                            </>
                        )
                    }
                    <div className="col-span-8">
                        {
                            pagination.data.length > 0 ? 
                                <DataTableCard heightContainer="max-h-[calc(100dvh-24rem)]" isActions={(permissionUpdate(module, routine) || permissionDelete(module, routine)) && event.status == "Rascunho"} pagination={pagination} columns={columns} changePage={changePage} actions={(obj) => (
                                    <>
                                    {
                                        permissionUpdate(module, routine) && event.status == "Rascunho" &&
                                        <IconEdit action="edit" obj={obj} getObj={getObj}/>
                                    }
                                    {
                                        permissionDelete(module, routine) && event.status == "Rascunho" &&
                                        <IconDelete action="delete" obj={obj} getObj={getObj}/> 
                                    }
                                    </>
                                )}/>
                                :
                                <NotData />
                            }
                    </div>
                </div>
                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <Button size="sm" variant="outline" onClick={closeModal}>Cancelar</Button>
                </div>
            </form>

            <ModalDelete confirm={destroy} isOpen={modalDelete} closeModal={() => setModalDelete(false)} title="Excluir Participante" />
        </ModalV2>    
    )
}