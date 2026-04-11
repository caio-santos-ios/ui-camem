"use client";

import { loadingAtom } from "@/jotai/global/loading.jotai";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { paginationAtom } from "@/jotai/global/pagination.jotai";
import { permissionDelete, permissionRead, permissionUpdate } from "@/utils/permission.util";
import { useModal } from "@/hooks/useModal";
import { IconEdit } from "@/components/icons/global/iconEdit/IconEdit";
import { IconDelete } from "@/components/icons/global/iconDelete/IconDelete";
import { ModalDelete } from "@/components/modal-delete/ModalDelete";
import { NotData } from "@/components/not-data/NotData";
import { DataTableCard } from "@/components/data-table-card/DataTableCard";
import { TDataTableColumns } from "@/types/global/data-table-card.type";
import { UserModalCreate } from "./UserModalCreate";
import { userAtom, userModalAtom, userModalUpdatePasswordAtom } from "@/jotai/master-data/user.jotai";
import { FaLock, FaUsers } from "react-icons/fa";
import { getUserLogged } from "@/utils/auth.util";
import { TUserLogged } from "@/types/master-data/user.type";
import { UserModalUpdatePassword } from "./UserModalUpdatePassword";
import { IconReprove } from "@/components/icons/global/iconReprove/IconRepprove";
import { IconApprove } from "@/components/icons/global/iconApprove/IconApprove";
import { ModalConfirm } from "@/components/modal-confirm/ModalConfirm";
import { IconUpdatePassword } from "@/components/icons/master-data/IconUpdatePassword";
import { IconForceApprove } from "@/components/icons/master-data/IconForceApprove";
import { MdCancel, MdCheckCircle, MdOutlinePendingActions } from "react-icons/md";

const columns: TDataTableColumns[] = [
  {title: "Nome", label: "name", type: "text"},
  {title: "RA", label: "ra", type: "text"},
  {title: "CPF", label: "cpf", type: "text"},
  {title: "E-mail", label: "email", type: "text"},
  {title: "Acesso", label: "statusAccess", type: "text"},
  {title: "Vínculo institucional", label: "profileUserName", type: "text"},
  // {title: "Data de Criação", label: "createdAt", type: "date"},
]

const module = "B";
const routine = "B1";

const TABS = [
  { key: "all",       title: "Todos Usuários" },
  { key: "pending",   title: "Pendentes" },
  { key: "approved",  title: "Aprovados" },
  { key: "reproved",  title: "Reprovados" },
];

export default function UserTable() {
  const [_, setLoading] = useAtom(loadingAtom);
  const [pagination, setPagination] = useAtom(paginationAtom); 
  const { isOpen, openModal, closeModal } = useModal();
  const [user, setUser] = useAtom(userAtom);
  const [modal, setModal] = useAtom(userModalAtom);
  const [modalStatusAccess, setModalStatusAccess] = useState(false);
  const [modalUpdatePassword, setModalUpdatePassword] = useAtom(userModalUpdatePasswordAtom);
  const [currentTab, setCurrentTab] = useState("all");
  const [currentStatusAccess, setCurrentStatusAccess] = useState("");
  const [tabs, setTabs] = useState<{key: string; title: string; quantity: number; icon: any}[]>([
    {icon: '', quantity: 0, key: "all",       title: "Todos Usuários" },
    {icon: '', quantity: 0, key: "pending",   title: "Pendentes" },
    {icon: '', quantity: 0, key: "approved",  title: "Aprovados" },
    {icon: '', quantity: 0, key: "reproved",  title: "Reprovados" },
  ]);
  const userLogged: TUserLogged = getUserLogged();

  const getAll = async (page: number, statusAccess: string) => {
    try {
      setLoading(true);
      let query = "deleted=false"
      if(statusAccess) query += `&statusAccess=${statusAccess}`;
      if(!userLogged.master) {
        query += "&ne$role=Master";
      }

      await getCount();

      const {data} = await api.get(`/users?${query}&orderBy=createdAt&sort=desc&pageSize=10&pageNumber=${page}`, configApi());
      const result = data.result;

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
  
  const getCount = async () => {
    try {
      setLoading(true);

      const {data} = await api.get(`/users/count?deleted=false`, configApi());
      const result = data.result.data;
      const countPending = result.filter((x: any) => x.statusAccess == "Pendente");
      const countApprove = result.filter((x: any) => x.statusAccess == "Aprovado");
      const countReprove = result.filter((x: any) => x.statusAccess == "Reprovado");

      setTabs([
        { icon: <FaUsers />, quantity: result.length, key: "all",       title: `Todos Usuários (${result.length})` },
        { icon: <MdOutlinePendingActions />, quantity: countPending.length, key: "pending",   title: `Pendentes (${countPending.length})` },
        { icon: <MdCheckCircle />, quantity: countApprove.length, key: "approved",  title: `Aprovados (${countApprove.length})` },
        { icon: <MdCancel />, quantity: countReprove.length, key: "reproved",  title: `Reprovados (${countReprove.length})` },
      ]);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const inputSearch = async (e: any) => {
    try {
      const search = e.target.value;
      let query = "";

      if(!search) {
        query = ""
      } else {
        query = `&regex$or$name=${search}&regex$or$email=${search}&regex$or$profileUserName=${search}`;
      }

      const {data} = await api.get(`/users?deleted=false${query}&orderBy=createdAt&sort=desc&pageSize=10&pageNumber=1`, configApi());
      const result = data.result;

      setPagination({
        currentPage: result.currentPage,
        data: result.data,
        sizePage: result.pageSize,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
      });
    } catch (error) {
      resolveResponse(error);
    }
  };
  
  const destroy = async () => {
    try {
      setLoading(true);
      await api.delete(`/users/${user.id}`, configApi());
      resolveResponse({status: 204, message: "Excluído com sucesso"});
      closeModal();
      await getAll(pagination.currentPage, currentStatusAccess);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatusAccess = async () => {
    try {
      setLoading(true);
      await api.put(`/users/status-access`, {...user}, configApi());
      resolveResponse({status: 200, message: `${user.statusAccess} com sucesso`});
      setModalStatusAccess(false);
      await getAll(pagination.currentPage, currentStatusAccess);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const getObj = (obj: any, action: string) => {
    setUser(obj);

    if(action == "edit") setModal(true);

    if(action == "update-password") { setModalUpdatePassword(true); }

    if(action == "delete") openModal();

    if(action == "approve") {
      setModalStatusAccess(true);
      setUser({...obj, statusAccess: "Aprovado"})
    };
    
    if(action == "reprove") {
      setModalStatusAccess(true);
      setUser({...obj, statusAccess: "Reprovado"})
    };
    
    if(action == "force-approve") {
      setModalStatusAccess(true);
      setUser({...obj, statusAccess: "Aprovado"})
    };
  };

  const changePage = async (page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));

    await getAll(page, currentStatusAccess);
  };

  const changeTab = async (key: string) => {
    setCurrentTab(key);
    let status = "";

    if(key == "pending") status = "Pendente";
    if(key == "approved") status = "Aprovado";
    if(key == "reproved") status = "Reprovado";

    setCurrentStatusAccess(status);
    await getAll(1, status);
  };

  useEffect(() => {
    if(permissionRead(module, routine)) {
      getAll(1, currentStatusAccess);
    };
  }, [modal, modalUpdatePassword]);

  return (
    <div>
      <div className="flex justify-around md:justify-start items-center font-medium gap-2 rounded-lg transition px-2 py-2 text-sm border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 mb-3 text-gray-700 dark:text-gray-400">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => changeTab(tab.key)}
            className={`${currentTab === tab.key ? "bg-brand-500 text-white" : ""} px-3 py-1 rounded-md transition-colors`}>
            <span className="hidden md:block">{tab.title}</span>
            <div className="flex flex-col justify-center items-center md:hidden">
              <span className="md:hidden">({tab.quantity})</span>
              <span className="md:hidden">
                {tab.icon}
              </span>
            </div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 mb-3">
        <input onInput={(e: any) => inputSearch(e)} placeholder="Busca rápida" type="text" className="input-erp-primary input-erp-default"/>
      </div>
      {
        pagination.data.length > 0 ? 
        <DataTableCard heightContainer="max-h-[calc(100dvh-24rem)]" isActions={permissionUpdate(module, routine) || permissionDelete(module, routine)} pagination={pagination} columns={columns} changePage={changePage} actions={(obj) => (
          <>
            {
              permissionUpdate(module, routine) && (obj.id == userLogged.id || userLogged.admin || userLogged.master) &&
              <IconUpdatePassword action="update-password" obj={obj} getObj={getObj}/>
            }
            {
              permissionUpdate(module, routine) && obj.statusAccess == "Reprovado" &&
              <IconForceApprove action="force-approve" obj={obj} getObj={getObj}/>
            }
            {
              permissionUpdate(module, routine) && obj.statusAccess == "Pendente" &&
              <IconApprove action="approve" obj={obj} getObj={getObj}/>
            }
            {
              permissionUpdate(module, routine) && obj.statusAccess == "Pendente" &&
              <IconReprove action="reprove" obj={obj} getObj={getObj}/>
            }
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
      <UserModalUpdatePassword />
      <ModalDelete confirm={destroy} isOpen={isOpen} closeModal={closeModal} title="Excluir Usuário" />
      <ModalConfirm size="lg" confirm={updateStatusAccess} isOpen={modalStatusAccess} closeModal={() => setModalStatusAccess(false)} title="Usuário" description={`Deseja ${user.statusAccess == "Aprovado" ? "Aprovar" : "Reprovar"} o acesso de ${user.name}?`} />
      <UserModalCreate />
    </div>    
  );
}