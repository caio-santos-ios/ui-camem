"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { ResetCustomCertificate, TCustomCertificate } from "@/types/custom-certificate/custom-certificate.type";
import { useAtom } from "jotai";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const module = "D";
const routine = "D1";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function CertificateTable() {
  const [_, setLoading] = useAtom(loadingAtom);

  const { register, reset, setValue, watch, getValues } = useForm<TCustomCertificate>({
    defaultValues: ResetCustomCertificate
  });

  const html = watch("html");

  const confirm = async (body: TCustomCertificate) => {
    if (!body.id) {
      await create(body);
    } else {
      await update(body);
    };
  }

  const create: SubmitHandler<TCustomCertificate> = async (body: TCustomCertificate) => {
    try {
      setLoading(true);
      const { data } = await api.post(`/custom-certificates`, body, configApi());
      resolveResponse({ status: 201, message: data.result.message });
      await getLast();
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const update: SubmitHandler<TCustomCertificate> = async (body: TCustomCertificate) => {
    try {
      setLoading(true);
      const { data } = await api.put(`/custom-certificates`, body, configApi());
      resolveResponse({ status: 200, message: data.result.message });
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const getLast = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/custom-certificates/last`, configApi());
      const result = data.result.data;
      console.log(result)
      reset({ ...result });
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLast();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ComponentCard title="Dados Gerais" hasHeader={false}>
        <div className="grid grid-cols-6 gap-2 max-h-[calc(100dvh-16rem)] md:max-h-[calc(100dvh-16rem)] overflow-y-auto">
          <div className="col-span-6">
            <Label title="HTML" />
            <div className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
              <MonacoEditor
                height={'450px'}
                language="html"
                theme="vs-dark"
                value={html}
                onChange={(value) => setValue("html", value ?? "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  formatOnPaste: true,
                  formatOnType: true,
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  tabSize: 2,
                }}
              />
            </div>
          </div>
        </div>
      </ComponentCard>

      <div className="h-full">
        <iframe
          srcDoc={html}
          className="w-full h-full rounded-xl border border-gray-200 dark:border-gray-700"
          sandbox="allow-same-origin"
          title="Preview HTML"
        />
      </div>

      <Button size="sm" variant="primary" onClick={() => confirm(getValues())}>Salvar</Button>
    </div>
  );
}