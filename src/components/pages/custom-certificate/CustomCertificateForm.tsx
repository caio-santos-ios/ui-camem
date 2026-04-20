"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { ResetCustomCertificate, TCustomCertificate } from "@/types/custom-certificate/custom-certificate.type";
import { ResetUserLogged, TUserLogged } from "@/types/master-data/user.type";
import { getUserLogged } from "@/utils/auth.util";
import { permissionRead } from "@/utils/permission.util";
import { useAtom } from "jotai";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BsUpload, BsTrash } from "react-icons/bs";

const module = "D";
const routine = "D1";

type TProp = {
  id?: string;
};

const PLACEHOLDERS = [
  { key: "{{name}}",       label: "Nome do participante" },
  { key: "{{function}}",   label: "Função"               },
  { key: "{{name_event}}", label: "Nome do evento"       },
  { key: "{{dates}}",      label: "Período"              },
  { key: "{{hours}}",      label: "Carga horária"        },
];

const PREVIEW_DEFAULTS: Record<string, string> = {
  "{{name}}":       "João da Silva",
  "{{function}}":   "Diretor(a) de Torcida",
  "{{name_event}}": "Semana Acadêmica de Medicina",
  "{{dates}}":      "01/04/2025 A 05/04/2025",
  "{{hours}}":      "68",
};

const replaceVariables = (
  html: string,
  bodyText: string,
  signers: {
    signer1Name: string; signer1Role: string; signer1Photo: string;
    signer2Name: string; signer2Role: string; signer2Photo: string;
    signer3Name: string; signer3Role: string; signer3Photo: string;
  }
): string => {
  let result = html;
  result = result.replaceAll("{{body_text}}", bodyText ?? "");
  result = result.replaceAll("{{signer1_name}}", signers.signer1Name || "");
  result = result.replaceAll("{{signer1_role}}", signers.signer1Role || "");
  result = result.replaceAll("{{signer1_photo}}", signers.signer1Photo ? `<img src="${signers.signer1Photo}" style="width:80px;height:36px;object-fit:contain;" />` : "");
  result = result.replaceAll("{{signer2_name}}", signers.signer2Name || "");
  result = result.replaceAll("{{signer2_role}}", signers.signer2Role || "");
  result = result.replaceAll("{{signer2_photo}}", signers.signer2Photo ? `<img src="${signers.signer2Photo}" style="width:80px;height:36px;object-fit:contain;" />` : "");
  result = result.replaceAll("{{signer3_name}}", signers.signer3Name || "");
  result = result.replaceAll("{{signer3_role}}", signers.signer3Role || "");
  result = result.replaceAll("{{signer3_photo}}", signers.signer3Photo ? `<img src="${signers.signer3Photo}" style="width:80px;height:36px;object-fit:contain;" />` : "");
  return Object.entries(PREVIEW_DEFAULTS).reduce(
    (acc, [key, val]) => acc.replaceAll(key, `<strong>${val}</strong>`),
    result
  );
};

const DEFAULT_CERTIFICATE_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Certificado</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, "Helvetica Neue", Helvetica, sans-serif; background: #fff; }
    .cert { width: 200mm; background: #fff; display: flex; flex-direction: column; }
    .band { height: 30px; background: #1f544b; flex-shrink: 0; }
    .content { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 22px 56px 18px; }
    .title { font-size: 30px; font-weight: 800; letter-spacing: 5px; color: #111; text-transform: uppercase; margin-bottom: 10px; }
    .intro { font-size: 13.5px; color: #111; text-align: center; margin-bottom: 8px; font-weight: 500; }
    .name-box { padding: 6px 40px; margin-bottom: 8px; }
    .name-box span { color: #111; font-size: 16px; font-weight: 700; }
    .body-text { font-size: 13.5px; color: #111; text-align: center; line-height: 1.8; max-width: 580px; margin-bottom: 10px; }
    .signatures {
      width: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 16px;
      margin-top: 20px;
    }

    .sig-center {
      display: flex;
      gap: 30px;
      justify-content: center;
      align-items: flex-end;
      flex: 1;
    }
    .sig-realizacao { font-size: 11.5px; color: #111; margin-bottom: 4px; display: block; }
    .sig-camem-label { width: 150px; height: 150px; }
    .sig-logo { width: 100%; }
    .sig-center { display: flex; gap: 40px; justify-content: space-between; flex: 1; margin-top: 30px; }
    .sig-person { display: flex; flex-direction: column; align-items: center; gap: 1px; }
    .sig-line { width: 155px; margin-bottom: 3px; }
    .sig-name { font-size: 13px; font-weight: 700; color: #111; }
    .sig-role { font-size: 11px; color: #444; }
    .card-qr-code { display: flex; flex-flow: column; align-items: flex-end; justify-content: flex-end; gap: 4px; }
    .auth-code { font-size: 7px; color: #444; text-align: right; max-width: 300px; line-height: 1.5; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="cert">
    <div class="band"></div>
    <div class="content">
      <div class="title">Certificado</div>
      <p class="intro">O Centro Acadêmico de Medicina de Maringá certifica que</p>
      <div class="name-box"><span>{{name}}</span></div>
      <p class="body-text">{{body_text}}</p>
      <div class="sig-center">
        <div class="sig-person">
          {{signer1_photo}}
          <div class="sig-line"></div>
          <span class="sig-name">{{signer1_name}}</span>
          <span class="sig-role">{{signer1_role}}</span>
        </div>
        <div class="sig-person">
          {{signer2_photo}}
          <div class="sig-line"></div>
          <span class="sig-name">{{signer2_name}}</span>
          <span class="sig-role">{{signer2_role}}</span>
        </div>
        <div class="sig-person">
          {{signer3_photo}}
          <div class="sig-line"></div>
          <span class="sig-name">{{signer3_name}}</span>
          <span class="sig-role">{{signer3_role}}</span>
        </div>
      </div>
      <div class="signatures">
        <div>
          <span class="sig-realizacao">Realização:</span>
          <div class="sig-camem-label">
            <img class="sig-logo" src="https://res.cloudinary.com/dia2yiu6k/image/upload/v1776611152/projeto-modelo/custom-certificate/logo_eapqjd.png" />
            <p class="auth-code"><strong>Livro CAMEM </strong> {{register_folder_number}} Registro nº {{register_book_number}}</p>
          </div>
        </div>
        <div class="card-qr-code">
          <div id="qrcode"></div>
          <p class="auth-code">Código de Autenticidade: <strong>{{key_certificate}}</strong></p>
          <p class="auth-code">Valide em: <strong>{{ui_uri}}/certificates-validate/{{key_certificate}}</strong></p>
        </div>
      </div>
    </div>
    <div class="band"></div>
  </div>
</body>
<script>
  new QRCode(document.getElementById("qrcode"), {
    text: "{{ui_uri}}/certificates-validate/{{key_certificate}}",
    width: 100, height: 100,
    colorDark: "#111111", colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
</script>
</html>`;

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type TSignerPhotoUploadProps = {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
};

const SignerPhotoUpload = ({ value, onChange, onRemove }: TSignerPhotoUploadProps) => {
  const inputRef        = useRef<HTMLInputElement>(null);
  const [_, setLoading] = useAtom(loadingAtom);

  const handleFile = async (file: File) => {
    try {
      setLoading(true);
      const form = new FormData();
      form.append("photo", file);
      const { data } = await api.put(`/custom-certificates/upload-signature`, form, configApi(false));
      onChange(data.result.data);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
      {value ? (
        <div className="relative">
          <img src={value} alt="Assinatura" className="h-10 object-contain rounded border border-gray-200 dark:border-gray-700 bg-white px-2" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center"
          >
            <BsTrash size={8} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors"
        >
          <BsUpload size={12} />
          Upload assinatura
        </button>
      )}
    </div>
  );
};

export default function CustomCertificateForm({ id }: TProp) {
  const [_, setLoading]             = useAtom(loadingAtom);
  const [userLogged, setUserLogged] = useState<TUserLogged>(ResetUserLogged);
  const [mounted, setMounted]       = useState(false);
  const [signerPhotos, setSignerPhotos] = useState({ s1: "", s2: "", s3: "" });

  const router = useRouter();

  const { register, reset, setValue, watch, getValues } = useForm<TCustomCertificate>({
    defaultValues: ResetCustomCertificate,
  });

  const html        = watch("html");
  const bodyText    = watch("bodyText");
  const signer1Name = watch("signer1Name");
  const signer1Role = watch("signer1Role");
  const signer2Name = watch("signer2Name");
  const signer2Role = watch("signer2Role");
  const signer3Name = watch("signer3Name");
  const signer3Role = watch("signer3Role");

  const insertPlaceholder = (key: string) => {
    const current = getValues("bodyText") ?? "";
    setValue("bodyText", current + key);
  };

  const confirm = async (body: TCustomCertificate) => {
    body.signer1Photo = signerPhotos.s1;
    body.signer2Photo = signerPhotos.s2;
    body.signer3Photo = signerPhotos.s3;
    if (!body.id) await create(body);
    else await update(body);
  };

  const create: SubmitHandler<TCustomCertificate> = async (body) => {
    try {
      setLoading(true);
      const { data } = await api.post(`/custom-certificates`, body, configApi());
      resolveResponse({ status: 200, message: data.result.message });
      router.push(`/custom-certificates/${data.result.data.id}`);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const update: SubmitHandler<TCustomCertificate> = async (body) => {
    try {
      setLoading(true);
      const { data } = await api.put(`/custom-certificates`, body, configApi());
      resolveResponse({ status: 200, message: data.result.message });
      await getById(data.result.data.id);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const getById = async (certId: string) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/custom-certificates/${certId}`, configApi());
      const result   = data.result.data;
      reset({
        ...result,
        bodyText:     result.bodyText     ?? "",
        signer1Name:  result.signer1Name  ?? "",
        signer1Role:  result.signer1Role  ?? "",
        signer2Name:  result.signer2Name  ?? "",
        signer2Role:  result.signer2Role  ?? "",
        signer3Name:  result.signer3Name  ?? "",
        signer3Role:  result.signer3Role  ?? "",
        registryText: result.registryText ?? "",
      });
      setSignerPhotos({
        s1: result.signer1Photo ?? "",
        s2: result.signer2Photo ?? "",
        s3: result.signer3Photo ?? "",
      });
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initial = async () => {
      setMounted(true);
      setUserLogged(getUserLogged());
      if (id === "create") setValue("html", DEFAULT_CERTIFICATE_HTML);
      else if (permissionRead(module, routine)) await getById(id!);
    };
    initial();
  }, []);

  const previewHtml = replaceVariables(html ?? "", bodyText ?? "", {
    signer1Name: signer1Name ?? "", signer1Role: signer1Role ?? "", signer1Photo: signerPhotos.s1,
    signer2Name: signer2Name ?? "", signer2Role: signer2Role ?? "", signer2Photo: signerPhotos.s2,
    signer3Name: signer3Name ?? "", signer3Role: signer3Role ?? "", signer3Photo: signerPhotos.s3,
  });

  const signers = [
    { nameKey: "signer1Name" as const, roleKey: "signer1Role" as const, photoKey: "s1" as const, label: "Assinante 1" },
    { nameKey: "signer2Name" as const, roleKey: "signer2Role" as const, photoKey: "s2" as const, label: "Assinante 2" },
    { nameKey: "signer3Name" as const, roleKey: "signer3Role" as const, photoKey: "s3" as const, label: "Assinante 3 (opcional)" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4 max-h-[calc(100dvh-15rem)] overflow-y-auto px-2">

          <ComponentCard title="Corpo do certificado" hasHeader>
            <div className="col-span-8 md:col-span-4">
              <Label title="Nome"/>
              <input placeholder="Nome" {...register("name")} type="text" className="input-erp-primary input-erp-default"/>
          </div>
            <div className="flex flex-col gap-3">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Escreva o texto livremente. Clique nos botões abaixo para inserir campos dinâmicos.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PLACEHOLDERS.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => insertPlaceholder(p.key)}
                    title={p.key}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <textarea
                {...register("bodyText")}
                rows={5}
                placeholder="Ex: participou como {{function}} do {{name_event}} de {{dates}}, perfazendo a carga horária de {{hours}} horas."
                className="w-full text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-brand-500 transition"
              />
            </div>
          </ComponentCard>

          <ComponentCard title="Assinaturas" hasHeader>
            <div className="flex flex-col gap-5">
              {signers.map((s) => (
                <div key={s.nameKey} className="flex flex-col gap-2">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{s.label}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <input {...register(s.nameKey)} placeholder="Nome" className="input-erp-primary input-erp-default" />
                    <input {...register(s.roleKey)} placeholder="Cargo" className="input-erp-primary input-erp-default" />
                  </div>
                  <SignerPhotoUpload
                    value={signerPhotos[s.photoKey]}
                    onChange={(url) => setSignerPhotos((prev) => ({ ...prev, [s.photoKey]: url }))}
                    onRemove={() => setSignerPhotos((prev) => ({ ...prev, [s.photoKey]: "" }))}
                  />
                </div>
              ))}
            </div>
          </ComponentCard>

          <ComponentCard title="HTML do Certificado" hasHeader>
            <div className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
              <MonacoEditor
                height="350px"
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
          </ComponentCard>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Preview</p>
            <p className="text-[11px] text-gray-400 dark:text-gray-600">Os campos destacados são exemplos</p>
          </div>
          <iframe
            srcDoc={previewHtml}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700"
            style={{ height: "calc(100dvh - 16rem)" }}
            sandbox="allow-same-origin allow-scripts"
            title="Preview do Certificado"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Link href="/custom-certificates">
          <Button variant="outline" size="sm">Voltar</Button>
        </Link>
        <Button size="sm" variant="primary" onClick={() => confirm(getValues())}>Salvar</Button>
      </div>
    </div>
  );
}