"use client";

import { DataTableCard } from "@/components/data-table-card/DataTableCard";
import { IconDelete } from "@/components/icons/global/iconDelete/IconDelete";
import { IconEdit } from "@/components/icons/global/iconEdit/IconEdit";
import { ModalDelete } from "@/components/modal-delete/ModalDelete";
import { NotData } from "@/components/not-data/NotData";
import { customCertificateAtom } from "@/jotai/custom-certificate/custom-certificate.jotai";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { modalDeleteAtom } from "@/jotai/global/modal.jotai";
import { paginationAtom } from "@/jotai/global/pagination.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { ResetCustomCertificate, TCustomCertificate } from "@/types/custom-certificate/custom-certificate.type";
import { TDataTableColumns } from "@/types/global/data-table-card.type";
import { ResetPagination } from "@/types/global/pagination.type";
import { permissionDelete, permissionRead, permissionUpdate } from "@/utils/permission.util";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const columns: TDataTableColumns[] = [
  {title: "Nome", label: "name", type: "text"},
  {title: "Data de Criação", label: "createdAt", type: "date"},
]

const module = "D";
const routine = "D1";

export default function CustomCertificateTable() {
  const [_, setLoading] = useAtom(loadingAtom);
  const [pagination, setPagination] = useAtom(paginationAtom);
  const [modalDelete, setModalDelete] = useAtom(modalDeleteAtom);
  const [customCertificate, setCustomCertificate] = useAtom(customCertificateAtom)

  const router = useRouter();

  const { register, reset, setValue, watch, getValues } = useForm<TCustomCertificate>({
    defaultValues: ResetCustomCertificate
  });

  const getAll = async (page: number) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/custom-certificates?deleted=false&orderBy=createdAt&sort=desc&pageSize=10&pageNumber=${page}`, configApi());
      const result = data?.result?.data ?? ResetPagination;

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
      await api.delete(`/custom-certificates/${customCertificate.id}`, configApi());
      resolveResponse({ status: 204, message: "Excluído com sucesso" });
      setModalDelete(false);
      reset(ResetCustomCertificate);
      
      await getAll(pagination.currentPage);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const getObj = (obj: any, action: string) => {
    setCustomCertificate(obj);

    if (action == "edit") router.push(`/custom-certificates/${obj.id}`);

    if (action == "delete") setModalDelete(true);
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
  }, []);
  
  return (
    <div>
      {
        pagination.data.length > 0 ?
          <DataTableCard heightContainer="max-h-[calc(100dvh-24rem)]" isActions={permissionUpdate(module, routine) || permissionDelete(module, routine)} pagination={pagination} columns={columns} changePage={changePage} actions={(obj) => (
            <>
              {
                permissionUpdate(module, routine) &&
                <IconEdit action="edit" obj={obj} getObj={getObj} />
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
      <ModalDelete confirm={destroy} isOpen={modalDelete} closeModal={() => { setModalDelete(false); setCustomCertificate(ResetCustomCertificate); }} title="Excluir Certificado" />
    </div>
  );
}