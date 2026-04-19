"use client";

import { DataTableCard } from "@/components/data-table-card/DataTableCard";
import Label from "@/components/form/Label";
import { IconDelete } from "@/components/icons/global/iconDelete/IconDelete";
import { IconEdit } from "@/components/icons/global/iconEdit/IconEdit";
import { ModalDelete } from "@/components/modal-delete/ModalDelete";
import { NotData } from "@/components/not-data/NotData";
import Button from "@/components/ui/button/Button";
import ModalV2 from "@/components/ui/modalV2"
import { eventAtom, eventParticipanFunctiontModalAtom, eventParticipantAtom, eventParticipantModalAtom } from "@/jotai/event/event.jotai";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { modalDeleteAtom } from "@/jotai/global/modal.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { ResetEventParticipant, ResetParticipantFunction, TParticipantFunction } from "@/types/event/event.type";
import { TDataTableColumns } from "@/types/global/data-table-card.type";
import { ResetPagination, TPagination } from "@/types/global/pagination.type";
import { TUser } from "@/types/master-data/user.type";
import { permissionDelete, permissionUpdate } from "@/utils/permission.util";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const columns: TDataTableColumns[] = [
    {title: "Nome da Função", label: "name", type: "text"},
    {title: "Horas", label: "hours", type: "text"},
]

const module = "F";
const routine = "F1";

export const EventParticipantFunctionModalCreate = () => {
    const [_, setLoading] = useAtom(loadingAtom);
    const [pagination, setPagination] = useState<TPagination>(ResetPagination);
    const [modal, setModal] = useAtom(eventParticipanFunctiontModalAtom);
    const [event] = useAtom(eventAtom);
    const [eventParticipant, setEventParticipant] = useAtom(eventParticipantAtom);
    const [modalDelete, setModalDelete] = useAtom(modalDeleteAtom);

    const { register, handleSubmit, reset, setValue, watch, getValues, control, formState: { errors }} = useForm<TParticipantFunction>({
        defaultValues: ResetEventParticipant
    });

    const closeModal = () => {
        setModal(false);
        setEventParticipant(ResetEventParticipant);
        reset(ResetEventParticipant);
    };

    const confirm = async (body: TParticipantFunction) => {
        setValue("eventId", event.id!);

        if(!body.id) {
            await create(body);
        } else {
            await update(body);
        };
    } 
        
    const create: SubmitHandler<TParticipantFunction> = async (body: TParticipantFunction) => {
        try {
            setLoading(true);
            const form: any = {...body};
            if(!body.hours || body.hours == 0) delete form.hours;
            
            const {data} = await api.post(`/event-participant-functions`, form, configApi());
            resolveResponse({status: 201, message: data.result.message});
            await getAll(1);
            setValue("name", "");
            setValue("hours", 0);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };
    
    const update: SubmitHandler<TParticipantFunction> = async (body: TParticipantFunction) => {
        try {
            setLoading(true);
            const form: any = {...body};
            if(!body.hours || body.hours == 0) delete form.hours;

            const {data} = await api.put(`/event-participant-functions`, form, configApi());
            resolveResponse({status: 200, message: data.result.message});
            await getAll(1);
            setValue("name", "");
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
            const {data} = await api.get(`/event-participant-functions/${id}`, configApi());
            const result = data.result.data;

            reset(result);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    const getAll = async (page: number) => {
        try {
            setLoading(true);
            const {data} = await api.get(`/event-participant-functions?deleted=false&eventId=${event.id}&orderBy=createdAt&sort=desc&pageSize=10&pageNumber=${page}`, configApi());
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

    const destroy = async () => {
        try {
            setLoading(true);
            await api.delete(`/event-participant-functions/${eventParticipant.id}`, configApi());
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
                getAll(1);
            };
        };
        initial();
    }, [event.id, modal]);

    return (
        <ModalV2 isOpen={modal} onClose={closeModal} title="Função" size="xl">
            <form className="flex flex-col p-6">
                <div className="grid grid-cols-8 gap-x-6 gap-y-5">
                    {
                        event.status == "Rascunho" && (
                            <>
                                <div className="col-span-8 md:col-span-4">
                                    <Label title="Nome da função"/>
                                    <input placeholder="Nome da função" {...register("name")} type="text" className="input-erp-primary input-erp-default"/>
                                </div>
                                <div className="col-span-8 md:col-span-2">
                                    <Label title="Horas"/>
                                    <input {...register("hours", { valueAsNumber: true })} type="number" placeholder="Horas" className="input-erp-primary input-erp-default no-spinner" />
                                </div>
                                <div className="col-span-8 md:col-span-2 flex items-end gap-4">
                                    <Button className="" size="sm" variant="outline" onClick={() => {reset(ResetParticipantFunction)}}>Cancelar</Button>
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