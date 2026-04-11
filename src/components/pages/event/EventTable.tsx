"use client";

import { loadingAtom } from "@/jotai/global/loading.jotai";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { paginationAtom } from "@/jotai/global/pagination.jotai";
import { permissionDelete, permissionRead, permissionUpdate } from "@/utils/permission.util";
import { IconEdit } from "@/components/icons/global/iconEdit/IconEdit";
import { IconDelete } from "@/components/icons/global/iconDelete/IconDelete";
import { ModalDelete } from "@/components/modal-delete/ModalDelete";
import { NotData } from "@/components/not-data/NotData";
import { EventModalCreate } from "./EventModalCreate";
import { EventCard } from "./EventCard";
import { eventAtom, eventModalAtom, eventParticipantModalPresenceAtom } from "@/jotai/event/event.jotai";
import { ResetPagination } from "@/types/global/pagination.type";
import { modalConfirmAtom, modalDeleteAtom } from "@/jotai/global/modal.jotai";
import Pagination from "@/components/tables/Pagination";
import { EventParticipantModalCreate } from "./EventParticipantModalCreate";
import { IconView } from "@/components/icons/global/iconView/IconView";
import { IconEventPublish } from "@/components/icons/event/IconEventPublish";
import { ModalConfirm } from "@/components/modal-confirm/ModalConfirm";
import { ResetEvent } from "@/types/event/event.type";
import { getUserLogged } from "@/utils/auth.util";
import { EventParticipantModalCreatePresence } from "./EventParticipantModalCreatePresence";
import { IconEventPresence } from "@/components/icons/event/IconEventPresence";

const module = "F";
const routine = "F1";

export default function EventTable() {
  const [_, setLoading] = useAtom(loadingAtom);
  const [pagination, setPagination] = useAtom(paginationAtom); 
  const [event, setEvent] = useAtom(eventAtom);
  const [modal, setModal] = useAtom(eventModalAtom);
  const [modalDelete, setModalDelete] = useAtom(modalDeleteAtom);
  const [modalConfirmPublish, setModalConfirmPublish] = useAtom(modalConfirmAtom);
  const [__, setModalParticipantPresence] = useAtom(eventParticipantModalPresenceAtom);
  const userLogged = getUserLogged();

  const getAll = async (page: number) => {
    try {
      setLoading(true);
      const isStudent = userLogged.role === "Student";
      const studentFilter = isStudent ? `&in$userIds=${userLogged.id}&status=Publicado` : "";

      const {data} = await api.get(`/events?deleted=false${studentFilter}&orderBy=createdAt&sort=desc&pageSize=10&pageNumber=${page}`, configApi());
      const result = data.result.data ?? ResetPagination;

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
  
  const destroy = async () => {
    try {
      setLoading(true);
      await api.delete(`/events/${event.id}`, configApi());
      resolveResponse({status: 204, message: "Excluído com sucesso"});
      setModalDelete(false);
      setEvent(ResetEvent);
      await getAll(pagination.currentPage);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };
  
  const publish = async () => {
    try {
      setLoading(true);
      await api.put(`/events/publish/`, event, configApi());
      resolveResponse({status: 200, message: "Publicado com sucesso"});
      setModalConfirmPublish(false);
      setEvent(ResetEvent);
      await getAll(pagination.currentPage);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const getObj = (obj: any, action: string) => {
    setEvent(obj);

    if(action == "edit" || action == "view") setModal(true);
    if(action == "publish") setModalConfirmPublish(true);
    if(action == "presence") setModalParticipantPresence(true);
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
    if(permissionRead(module, routine)) {
      getAll(1);
    };
  }, [modal]);

  return (
    <div>
      {
        pagination.data.length > 0 ? 
        <>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-h-[calc(100dvh-17rem)] overflow-y-auto gap-4 mb-3">
            {
              pagination.data.map((obj: any) => {
                return (
                  <EventCard key={obj.id} id={obj.id} title={obj.title} description={obj.description} startDate={obj.startDate} endDate={obj.endDate} participants={obj.participants ?? []} 
                    actions={
                      <div className="flex gap-4">
                        {
                          permissionUpdate(module, routine) && obj.status == "Rascunho" &&
                          <IconEventPublish action="publish" obj={obj} getObj={getObj}/>
                        }
                        {
                          permissionRead(module, routine) && obj.status == "Publicado" && userLogged.role != "Student" &&
                          <IconView action="view" obj={obj} getObj={getObj}/>
                        }
                        {
                          permissionUpdate(module, routine) && obj.status == "Publicado" &&
                          <IconEventPresence action="presence" obj={obj} getObj={getObj}/>
                        }
                        {
                          permissionUpdate(module, routine) && obj.status == "Rascunho" &&
                          <IconEdit action="edit" obj={obj} getObj={getObj}/>
                        }
                        {
                          permissionDelete(module, routine) && obj.status == "Rascunho" &&
                          <IconDelete action="delete" obj={obj} getObj={getObj}/> 
                        }
                      </div>
                    }
                  />
                ) 
              })
            }
          </ul>
          <Pagination currentPage={pagination.currentPage} totalCount={pagination.totalCount} totalData={pagination.data.length} totalPages={pagination.totalPages} onPageChange={changePage} />
        </>
        :
        <NotData />
      }
      <ModalConfirm confirm={publish} isOpen={modalConfirmPublish} closeModal={() => { setModalConfirmPublish(false); setEvent(ResetEvent); }} title="Evento" description="Deseja publicar esse evento?" />
      <ModalDelete confirm={destroy} isOpen={modalDelete} closeModal={() => { setModalDelete(false); setEvent(ResetEvent); }} title="Excluir Evento" />
      <EventModalCreate />
      <EventParticipantModalCreate />
      <EventParticipantModalCreatePresence />
    </div>    
  );
}