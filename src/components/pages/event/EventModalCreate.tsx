"use client";

import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import ModalV2 from "@/components/ui/modalV2"
import RichTextEditor from "@/components/ui/text-editor/RichTextEditor";
import { eventAtom, eventModalAtom, eventParticipantModalAtom } from "@/jotai/event/event.jotai";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { ResetEvent, TEvent } from "@/types/event/event.type";
import { toISOOrNull } from "@/utils/mask.util";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export const EventModalCreate = () => {
    const [_, setLoading] = useAtom(loadingAtom);
    const [modal, setModal] = useAtom(eventModalAtom);
    const [__, setModalEventParticipant] = useAtom(eventParticipantModalAtom);
    const [event, setEvent] = useAtom(eventAtom);
    const { register, handleSubmit, reset, setValue, watch, getValues, formState: { errors }} = useForm<TEvent>({
        defaultValues: ResetEvent
    });

    const description = watch("description");

    const closeModal = () => {
        setModal(false);
        setEvent(ResetEvent);
        reset(ResetEvent);
    };

    const confirm = async (body: TEvent) => {
        body.startDate = toISOOrNull(body.startDate);
        body.endDate   = toISOOrNull(body.endDate);

        if(!body.id) {
            await create(body);
        } else {
            await update(body);
        };
    } 
        
    const create: SubmitHandler<TEvent> = async (body: TEvent) => {
        try {
            setLoading(true);
            const {data} = await api.post(`/events`, body, configApi());
            resolveResponse({status: 201, message: data.result.message});
            closeModal();
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };
        
    const update: SubmitHandler<TEvent> = async (body: TEvent) => {
        try {
            setLoading(true);
            const {data} = await api.put(`/events`, body, configApi());
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
            const {data} = await api.get(`/events/${id}`, configApi());
            const result = data.result.data;
            reset({...result, startDate: result.startDate.split("T")[0], endDate: result.endDate ? result.endDate.split("T")[0] : null});
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        reset(ResetEvent);
        
        if(event.id && modal) {
            getById(event.id);
        };
    }, [event.id, modal]);

    return (
        <ModalV2 isOpen={modal} onClose={closeModal} title="Evento" size="lg">
            <form className="flex flex-col p-6">
                <div className="grid grid-cols-8 gap-x-6 gap-y-5">
                    <div className="col-span-8 md:col-span-4">
                        <Label title="Título"/>
                        <input disabled={event.status == "Publicado"} placeholder="Título" {...register("title")} type="text" className="input-erp-primary input-erp-default"/>
                    </div>
                    <div className="col-span-4 md:col-span-2">
                        <Label title="Data Inicial"/>
                        <input disabled={event.status == "Publicado"} {...register("startDate")} type="date" className="input-erp-primary input-erp-default" />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                        <Label title="Data Final" required={false}/>
                        <input disabled={event.status == "Publicado"} {...register("endDate")} type="date" className="input-erp-primary input-erp-default" />
                    </div>
                    <div className="col-span-8">
                        <Label title="Descrição"/>
                        <RichTextEditor
                            disabled={event.status == "Publicado"}
                            label=""
                            placeholder="Digite a descrição do evento..."
                            value={description}
                            onChange={(html) => setValue("description", html)}
                            minHeight={300}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <Button size="sm" variant="outline" onClick={closeModal}>Cancelar</Button>
                    {event.id && <Button size="sm" variant="outline" onClick={() => {setModalEventParticipant(true)}}>Participantes</Button>}
                    {event.status == "Rascunho" && <Button size="sm" variant="primary" onClick={() => confirm(getValues())}>Confirmar</Button>}
                </div>
            </form>
        </ModalV2>    
    )
}