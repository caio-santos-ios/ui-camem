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
import { ResetEventParticipant, TEventParticipant } from "@/types/event/event.type";
import { TDataTableColumns } from "@/types/global/data-table-card.type";
import { ResetPagination, TPagination } from "@/types/global/pagination.type";
import { TUser } from "@/types/master-data/user.type";
import { permissionDelete, permissionUpdate } from "@/utils/permission.util";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

const columns: TDataTableColumns[] = [
    {title: "Nome no Certificado", label: "name", type: "text"},
    {title: "RA", label: "userRa", type: "text"},
    {title: "CPF", label: "userCpf", type: "text"},
    {title: "Funções", label: "function", type: "text"},
    {title: "Horas", label: "hour", type: "text"},
]

const module = "F";
const routine = "F1";

export const EventParticipantModalCreate = () => {
    const [_, setLoading] = useAtom(loadingAtom);
    const [pagination, setPagination] = useState<TPagination>(ResetPagination);
    const [modal, setModal] = useAtom(eventParticipantModalAtom);
    const [event, setEvent] = useAtom(eventAtom);
    const [eventParticipant, setEventParticipant] = useAtom(eventParticipantAtom);
    const [users, setUsers] = useState<TUser[]>([]);
    const [modalDelete, setModalDelete] = useAtom(modalDeleteAtom);
    const [autocompleteKey, setAutocompleteKey] = useState(0);
    const abortRef = useRef<AbortController | null>(null);

    const { register, handleSubmit, reset, setValue, watch, getValues, control, formState: { errors }} = useForm<TEventParticipant>({
        defaultValues: ResetEventParticipant
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "functions"
    });
    
    const eventParticipantId = watch("id");
    const userName = watch("userName");

    const closeModal = () => {
        setModal(false);
        setEventParticipant(ResetEventParticipant);
        reset(ResetEventParticipant);
    };

    const confirm = async (body: TEventParticipant) => {
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
            reset(ResetEventParticipant);
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
            reset(ResetEventParticipant);
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
            const {data} = await api.get(`/event-participants?deleted=false&eventId=${event.id}&orderBy=createdAt&sort=desc&pageSize=10&pageNumber=${page}`, configApi());
            const result = data.result.data ?? ResetPagination;
            
            setPagination({
                ...ResetPagination,
                currentPage: result.currentPage,
                data: result.data.map((x: any) => ({...x, function: x.functions.map((x: any) => (x.name)).join("/"), hour: x.functions.map((x: any) => (x.hours)).join("/")})),
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

    const getAutocompleUsers = async (value: string) => {
        try {
            abortRef.current?.abort();
    
            if (!value.trim()) {
                setUsers([]);
                return;
            }
    
            abortRef.current = new AbortController();
    
            const {data} = await api.get(`/users/select?deleted=false&regex$or$name=${value}&in$role=Student,Teacher,Director,Coordinator&statusAccess=Aprovado`, configApi());
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
                getAll(1);
            };
        };
        initial();
    }, [event.id, modal]);

    return (
        <ModalV2 isOpen={modal} onClose={closeModal} title="Participantes" size="xl">
            <form className="flex flex-col p-6">
                <div className="grid grid-cols-8 gap-x-6 gap-y-5">
                    <div className="col-span-8 md:col-span-4">
                        <Label title="Usuário" required={false}/>
                        <Autocomplete key={autocompleteKey} placeholder="Buscar Usuário..." defaultValue={userName} objKey="id" objValue="description" onSearch={(value: string) => getAutocompleUsers(value)} onSelect={(opt) => {
                            setValue("userId", opt.id);
                            setValue("name", opt.name)
                            setUsers([]);
                        }} options={users}/>
                    </div>
                    <div className="col-span-8 md:col-span-4">
                        <Label title="Nome no Certificado"/>
                        <input placeholder="Nome no Certificado" {...register("name")} type="text" className="input-erp-primary input-erp-default"/>
                    </div>
                    <div className="col-span-8">
                        <div className="flex items-center justify-between mb-2">
                            <Label title="Funções" required={false}/>
                            <div className="flex gap-4">
                                <Button size="sm" variant="primary" onClick={() => append({ name: "", hours: 0 })}>Adicionar função</Button>
                                <Button size="sm" variant="outline" onClick={() => {
                                    reset(ResetEventParticipant);
                                    setEventParticipant(ResetEventParticipant);
                                    setUsers([]);
                                    setAutocompleteKey(prev => prev + 1); // ← força re-render
                                }}>
                                    {eventParticipantId ? 'Cancelar Alteração' : 'Cancelar Criação'}
                                </Button>
                                <Button size="sm" variant="primary" onClick={() => confirm(getValues())}>Salvar Participante</Button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                        {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-8 gap-3 items-center">
                                <div className="col-span-4">
                                    <input {...register(`functions.${index}.name`)} placeholder="Nome da função" className="input-erp-primary input-erp-default" />
                                </div>
                                <div className="col-span-2">
                                    <input {...register(`functions.${index}.hours`, { valueAsNumber: true })} type="number" placeholder="Horas" className="input-erp-primary input-erp-default" />
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <IconDelete action="delete" getObj={() => remove(index)} obj={{}}/>
                                </div>
                            </div>
                        ))}
                        </div>

                        {fields.length === 0 && (
                            <p className="text-xs text-gray-400 dark:text-gray-600 py-2">
                                Nenhuma função adicionada.
                            </p>
                        )}
                    </div>
                    <div className="col-span-8">
                        {
                            pagination.data.length > 0 ? 
                                <DataTableCard heightContainer="max-h-[calc(100dvh-24rem)]" isActions={permissionUpdate(module, routine) || permissionDelete(module, routine)} pagination={pagination} columns={columns} changePage={changePage} actions={(obj) => (
                                    <>
                                    {
                                        permissionUpdate(module, routine) &&
                                        <IconEdit action="edit" obj={obj} getObj={getObj}/>
                                    }
                                    {
                                        permissionDelete(module, routine) &&
                                        <IconDelete action="delete" obj={obj} getObj={getObj}/> 
                                    }
                                    </>
                                )
                                }/>
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