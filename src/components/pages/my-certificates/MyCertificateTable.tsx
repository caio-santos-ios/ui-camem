"use client";

import { loadingAtom } from "@/jotai/global/loading.jotai";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { paginationAtom } from "@/jotai/global/pagination.jotai";
import { permissionRead } from "@/utils/permission.util";
import { NotData } from "@/components/not-data/NotData";
import { ResetPagination } from "@/types/global/pagination.type";
import Pagination from "@/components/tables/Pagination";
import { getUserLogged } from "@/utils/auth.util";
import { MyCertificateCard } from "./MyCertificateCard";

const module = "E";
const routine = "E1";

export default function MyCertificateTable() {
  const [_, setLoading] = useAtom(loadingAtom);
  const [pagination, setPagination] = useAtom(paginationAtom); 
  const userLogged = getUserLogged();

  const getAll = async (page: number) => {
    try {
      setLoading(true);
      const {data} = await api.get(`/certificates?deleted=false&userId=${userLogged.id}&orderBy=createdAt&sort=desc&pageSize=10&pageNumber=${page}`, configApi());
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
        <>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-h-[calc(100dvh-17rem)] overflow-y-auto gap-4 mb-3">
            {
              pagination.data.map((obj: any) => {
                return (
                  <MyCertificateCard 
                    key={obj.id} 
                    name={obj.name} 
                    hours={obj.hours} 
                    startDate={obj.startDate} 
                    endDate={obj.endDate} 
                    nameEvent={obj.nameEvent} 
                    functions={obj.functions}
                    keyCertificate={obj.keyCertificate}
                    html={obj.html}
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
    </div>    
  );
}