"use client";

import Button from "@/components/ui/button/Button";
import ModalV2 from "@/components/ui/modalV2"
import { eventAtom, eventParticipantModalPresenceAtom } from "@/jotai/event/event.jotai";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { ResetEvent, ResetEventParticipant, TEvent, TEventParticipant } from "@/types/event/event.type";
import { ResetPagination, TPagination } from "@/types/global/pagination.type";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { EventParticipantCardPresence } from "./EventParticipantCardPresence";
import Label from "@/components/form/Label";

export const EventParticipantModalCreatePresence = () => {
    const [_, setLoading] = useAtom(loadingAtom);
    const [pagination, setPagination] = useState<TPagination>(ResetPagination);
    const [modal, setModal] = useAtom(eventParticipantModalPresenceAtom);
    const [event, setEvent] = useAtom(eventAtom);
    const [openId, setOpenId] = useState<string | null>(null);

    const { reset, register, setValue, watch, getValues } = useForm<TEventParticipant>({
        defaultValues: ResetEventParticipant
    });

    const closeModal = () => {
        setModal(false);
        setEvent(ResetEvent);
        reset(ResetEventParticipant);
    };

    const confirm = async (body: TEventParticipant) => {
        try {
            setLoading(true);
            const {data} = await api.put(`/event-participants/presence`, body, configApi());
            resolveResponse({status: 200, message: data.result.message});
            await getAll(1);
            reset(ResetEventParticipant);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    }
    
    const finish = async (body: TEvent) => {
        try {
            setLoading(true);
            const {data} = await api.put(`/events/finish`, body, configApi());
            resolveResponse({status: 200, message: data.result.message});
            closeModal()
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    }

    const getAll = async (page: number) => {
        try {
            setLoading(true);
            const {data} = await api.get(`/event-participants?deleted=false&eventId=${event.id}&orderBy=createdAt&sort=desc&pageSize=10&pageNumber=${page}`, configApi());
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
        <ModalV2 isOpen={modal} onClose={closeModal} title="Presença Participantes" size="xl">
            <form className="flex flex-col p-6">
                <div className="grid grid-cols-8 gap-4 max-h-[calc(100dvh-15rem)] overflow-y-auto px-2">
                    <div className="col-span-8">
                        {
                            pagination.data.map((x: any) => {
                                return <EventParticipantCardPresence key={x.id} getValues={getValues} setValue={setValue} watch={watch} participant={x} open={openId === x.id} onToggle={() => setOpenId(openId === x.id ? null : x.id)} onSave={(obj) => confirm({...obj, functionId: x.functionId, id: x.id})} />
                            })
                        }
                    </div>
                    <div className="col-span-8">
                        <Label title="Livro de Registro"/>
                        <input placeholder="Livro de Registro" onChange={(e) => {setEvent(evt => ({...evt, registerBookNumber: e.target.value}))}} type="text" className="input-erp-primary input-erp-default"/>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <Button size="sm" variant="outline" onClick={closeModal}>Cancelar</Button>
                    <Button size="sm" variant="primary" onClick={() => finish(event)}>Finalizar Evento</Button>
                </div>
            </form>
        </ModalV2>    
    )
}