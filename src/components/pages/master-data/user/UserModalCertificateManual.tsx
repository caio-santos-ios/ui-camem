"use client";

import { DataTableCard } from "@/components/data-table-card/DataTableCard";
import Label from "@/components/form/Label";
import { IconDelete } from "@/components/icons/global/iconDelete/IconDelete";
import { IconEdit } from "@/components/icons/global/iconEdit/IconEdit";
import { ModalDelete } from "@/components/modal-delete/ModalDelete";
import { NotData } from "@/components/not-data/NotData";
import Button from "@/components/ui/button/Button";
import ModalV2 from "@/components/ui/modalV2"
import { useModal } from "@/hooks/useModal";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { modalCertificateManualAtom, userAtom } from "@/jotai/master-data/user.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { TDataTableColumns } from "@/types/global/data-table-card.type";
import { ResetPagination, TPagination } from "@/types/global/pagination.type";
import { ResetCertificateManual, TCertificateManual, TCertificateManualParticipantFunction } from "@/types/master-data/certificate-manual.type";
import { ResetUser } from "@/types/master-data/user.type";
import { permissionDelete, permissionRead, permissionUpdate } from "@/utils/permission.util";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BsDash } from "react-icons/bs";
import { FaCheck, FaPlus } from "react-icons/fa";
import { GrDocumentVerified } from "react-icons/gr";
import { MdEdit } from "react-icons/md";


const columns: TDataTableColumns[] = [
    { title: "Nome do Evento", label: "nameEvent", type: "text" },
    { title: "Nome", label: "name", type: "text" },
    { title: "Data inicio", label: "startDate", type: "date" },
    { title: "Data fim", label: "endDate", type: "date" },
    { title: "Horas", label: "hours", type: "text" },
    { title: "Token de verificação", label: "keyCertificate", type: "text" },
]

const module = "B";
const routine = "B1";

export const UserModalCertificateManual = () => {
    const [modal, setModal] = useAtom(modalCertificateManualAtom);
    const [certificateManual, setCertificateManual] = useState(ResetCertificateManual);
    const [user, setUser] = useAtom(userAtom);
    const [_, setLoading] = useAtom(loadingAtom);
    const [file, setFile] = useState<File | null>(null);
    const [isForm, setIsForm] = useState(false);
    const [pagination, setPagination] = useState<TPagination>(ResetPagination);
    const { isOpen, openModal, closeModal } = useModal();

    const { register, reset, setValue, watch, getValues, formState: { errors } } = useForm<TCertificateManual>({
        defaultValues: ResetCertificateManual
    });

    let participantFunctions = watch("participantFunction");

    const closedModal = () => {
        setIsForm(false);
        setModal(false);
        setUser(ResetUser);
        reset(ResetCertificateManual);
    };

    const confirm = async (body: TCertificateManual) => {
        const form: FormData = new FormData();
        form.append("userId", body.userId);
        form.append("nameEvent", body.nameEvent);
        form.append("startDateEvent", body.startDateEvent);
        if (body.endDateEvent) {
            form.append("endDateEvent", body.endDateEvent);
        }
        form.append("registerBookNumberEvent", body.registerBookNumberEvent);
        form.append("registerFolderNumberEvent", body.registerFolderNumberEvent);
        form.append("keyCertificateEvent", body.keyCertificateEvent);
        form.append("nameParticipantEvent", body.nameParticipantEvent);
        const arr: string = body.participantFunction.map((x: TCertificateManualParticipantFunction) => (`${x.name},${x.hours}`)).join(";");

        form.append("participantFunction", arr);

        if (file) {
            form.append("certificate", file);
        }

        await create(form);
    }

    const create: SubmitHandler<FormData> = async (body: FormData) => {
        try {
            setLoading(true);
            const { data } = await api.post(`/custom-certificates/certificate-manual`, body, configApi(false));
            resolveResponse({ status: 201, message: data.result.message });
            setCertificateManual(ResetCertificateManual);
            reset(ResetCertificateManual);
            setIsForm(false);
            await getById(user.id, pagination.currentPage);
            setValue("userId", user.id);
            setValue("nameParticipantEvent", user.name);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    const getById = async (id: string, page: number) => {
        try {
            setLoading(true);
            const { data } = await api.get(`/certificates?deleted=false&userId=${id}&origin=manual`, configApi());
            const result = data.result.data;

            setPagination({
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

    const addLine = () => {
        const current = getValues("participantFunction") ?? [];
        setValue("participantFunction", [
            ...current,
            { name: "", hours: "" }
        ]);
    };

    const removeLine = (index: number) => {
        const current = getValues("participantFunction") ?? [];
        setValue(
            "participantFunction",
            current.filter((_: any, i: number) => i !== index)
        );
    };

    const changePage = async (page: number) => {
        setPagination(prev => ({
            ...prev,
            currentPage: page
        }));

        await getById(user.id, page);
    };

    const getObj = (obj: any, action: string) => {
        setCertificateManual(obj);

        if (action == "delete") openModal();
    };

    const destroy = async () => {
        try {
            setLoading(true);
            await api.delete(`/certificates/${certificateManual.id}`, configApi());
            resolveResponse({ status: 204, message: "Excluído com sucesso" });

            setCertificateManual(ResetCertificateManual);
            closeModal();
            await getById(user.id, pagination.currentPage);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (user.id && modal) {
            setIsForm(false);
            setValue("userId", user.id);
            setValue("nameParticipantEvent", user.name);

            getById(user.id, 1);
        };
    }, [user.id, modal]);

    return (
        <ModalV2 isOpen={modal} onClose={closedModal} title="Certificado manual" size={`${isForm ? 'lg' : 'xl'}`}>
            {
                !isForm && (
                    <form className="flex flex-col p-6 max-h-[calc(100dvh-7rem)]">
                        <div className="grid grid-cols-12 gap-x-6 gap-y-5 overflow-y-auto">
                            <div className="col-span-12 flex justify-end">
                                <Button size="sm" variant="primary" onClick={() => setIsForm(true)}>Adicionar</Button>
                            </div>
                            <div className="col-span-12">
                                {
                                    pagination.data.length > 0 ?
                                        <DataTableCard heightContainer="max-h-[calc(100dvh-24rem)]" isActions={permissionRead(module, routine) || permissionDelete(module, routine)} pagination={pagination} columns={columns} changePage={changePage} actions={(obj) => (
                                            <>
                                                {
                                                    permissionRead(module, routine) &&
                                                    <a href={obj.html} target="_blank">
                                                        <div title="Visualizar Certificado" onClick={() => { }} className="cursor-pointer text-yellow-400 hover:text-yellow-500">
                                                            <GrDocumentVerified />
                                                        </div>
                                                    </a>
                                                }
                                                {
                                                    permissionDelete(module, routine) &&
                                                    <IconDelete action="delete" obj={obj} getObj={getObj} />
                                                }
                                            </>
                                        )
                                        } />
                                        :
                                        <NotData />
                                }
                            </div>
                        </div>
                    </form>
                )
            }

            {
                isForm && (
                    <form className="flex flex-col p-6 max-h-[calc(100dvh-7rem)]">
                        <div className="grid grid-cols-12 gap-x-6 gap-y-5 overflow-y-auto">
                            <div className="col-span-12 md:col-span-6">
                                <Label title="Nome do evento" />
                                <input placeholder="Nome do evento" {...register("nameEvent")} type="text" className="input-erp-primary input-erp-default" />
                            </div>

                            <div className="col-span-12 md:col-span-3">
                                <Label title="Data Inicial do Evento" />
                                <input {...register("startDateEvent")} type="date" className="input-erp-primary input-erp-default" />
                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <Label title="Data Final do Evento" required={false} />
                                <input {...register("endDateEvent")} type="date" className="input-erp-primary input-erp-default" />
                            </div>

                            <div className="col-span-12 md:col-span-3">
                                <Label title="Pasta de Registro" />
                                <input {...register("registerBookNumberEvent")} placeholder="Pasta de Registro" type="text" className="input-erp-primary input-erp-default" />
                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <Label title="Livro de Registro" />
                                <input {...register("registerFolderNumberEvent")} placeholder="Livro de Registro" type="text" className="input-erp-primary input-erp-default" />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Label title="Token de verificação" />
                                <input {...register("keyCertificateEvent")} placeholder="Token de verificação" type="text" className="input-erp-primary input-erp-default" />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Label title="Nome no Certificado" />
                                <input {...register("nameParticipantEvent")} placeholder="Nome no Certificado" type="text" className="input-erp-primary input-erp-default" />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Label title="Certificado" />
                                <input onChange={(e) => {
                                    if (e.target.files) {
                                        setFile(e.target.files[0])
                                    }
                                }} id="certificate" placeholder="Certificado" type="file" className="input-erp-primary input-erp-default" />
                            </div>
                            <div className="col-span-12 md:col-span-6"> </div>
                            <div className="col-span-12">
                                {
                                    participantFunctions.map((e: any, index: number) => {
                                        return (
                                            <div key={index} className="grid grid-cols-12 gap-x-6 gap-y-5 mb-2">
                                                <div className="col-span-12 md:col-span-5">
                                                    <Label title="Nome da função" />
                                                    <input {...register(`participantFunction.${index}.name`)} placeholder="Nome da função" type="text" className="input-erp-primary input-erp-default" />
                                                </div>
                                                <div className="col-span-12 md:col-span-5">
                                                    <Label title="Horas da função" />
                                                    <input {...register(`participantFunction.${index}.hours`, { valueAsNumber: true })} placeholder="Horas da função" type="number" className="input-erp-primary input-erp-default no-spinner" />
                                                </div>
                                                <div className="col-span-12 md:col-span-2 flex items-end gap-2">
                                                    <Button size="sm" variant="primary" onClick={() => { console.log(participantFunctions) }}><FaCheck /></Button>
                                                    {
                                                        index < participantFunctions.length - 1 && (
                                                            <Button size="sm" variant="primary" onClick={() => removeLine(index)}><BsDash /></Button>
                                                        )
                                                    }
                                                    {
                                                        index == participantFunctions.length - 1 && (
                                                            <Button size="sm" variant="primary" onClick={() => addLine()}><FaPlus /></Button>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closedModal}>Fechar</Button>
                            <Button size="sm" variant="outline" onClick={() => {
                                setIsForm(false);
                                reset(ResetCertificateManual);
                                setCertificateManual(ResetCertificateManual);
                                setValue("userId", user.id);
                                setValue("nameParticipantEvent", user.name);
                            }}>Cancelar</Button>
                            <Button size="sm" variant="primary" onClick={() => confirm(getValues())}>Confirmar</Button>
                        </div>
                    </form>
                )
            }

            <ModalDelete confirm={destroy} isOpen={isOpen} closeModal={closeModal} title="Excluir Certificado Manual" />
        </ModalV2>
    )
}