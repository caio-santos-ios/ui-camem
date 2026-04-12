import { maskDate } from "@/utils/mask.util";
import { BiCalendar, BiDownload } from "react-icons/bi";
import { FiClock } from "react-icons/fi";
import { MdWorkspacePremium } from "react-icons/md";

type TCertificateCard = {
  name: string;
  nameEvent: string;
  startDate: string;
  endDate?: string | null;
  hours: number;
  functionName?: string;
  keyCertificate: string;
  functions: string[];
  onDownload?: () => void;
};

export const downloadCertificate = async (data: {
  name: string;
  nameEvent: string;
  startDate: string;
  endDate?: string | null;
  hours: number;
  functionName?: string;
  functions: string[];
  keyCertificate: string;
}) => {
  const dates = `${maskDate(data.startDate)}${data.endDate ? ` A ${maskDate(data.endDate)}` : ""}`;
  
  let logoBase64 = "";
  try {
    const res  = await fetch("/assets/images/logo.png");
    const blob = await res.blob();
    logoBase64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (_) {}

  const getArticle = (name: string): string => {
    const lower = name.toLowerCase().trim();
    const femininos = ["a", "ã", "agem", "ção", "são", "dade", "tude", "ice", "ise", "eza"];
    return femininos.some(end => lower.endsWith(end)) ? "da" : "do";
  };

  const getFunctions = (functions: string[]): string => {
    if(functions.length > 1) {
      const newFunctions = functions.slice(1, functions.length);
      if(newFunctions.length > 1) {
        const functionsAll = functions.slice(0, functions.length - 1);
        return `${functionsAll.join(", ")} e ${functions[functions.length - 1]}`;
      } else {
        return `${functions[0]} e ${newFunctions[0]}`;
      }
    }
    else {
      return `${functions[0]}`;
    }
  };

  const html = `<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8" />
  <title>Certificado - ${data.nameEvent}</title>
  <link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap"
    rel="stylesheet" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
      background: #fff;
    }

    .cert {
      width: 200mm;
      background: #fff;
      display: flex;
      flex-direction: column;
    }

    .band {
      height: 30px;
      background: #1f544b;
      flex-shrink: 0;
    }

    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 22px 56px 18px;
    }

    .title {
      font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
      font-size: 30px;
      font-weight: 800;
      letter-spacing: 5px;
      color: #111;
      text-transform: uppercase;
      margin-bottom: 10px;
      text-underline-offset: 4px;
    }

    .intro {
      font-size: 13.5px;
      color: #111;
      text-align: center;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .name-box {
      border-radius: 2px;
      padding: 6px 40px;
      margin-bottom: 8px;
      color: #111;
    }

    .name-box span {
      color: #111;
      font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;;
      font-size: 16px;
      font-weight: 700;
    }

    .body-text {
      font-size: 13.5px;
      color: #111;
      text-align: center;
      line-height: 1.8;
      max-width: 580px;
      margin-bottom: 10px;
    }

    .signatures {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-top: 10px;
    }

    .sig-realizacao {
      font-size: 11.5px;
      color: #111;
      margin-bottom: 4px;
      display: block;
    }

    .sig-wave {
      width: 80px;
      height: 36px;
    }

    .sig-camem-label {
      width: 150px;
      height: 150px;
    }

    .sig-logo {
      width: 100%;
    }

    .sig-center {
      display: flex;
      gap: 50px;
      justify-content: center;
      flex: 1;
      margin-top: 30px;
    }

    .sig-person {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1px;
    }

    .sig-line {
      width: 155px;
      margin-bottom: 3px;
    }

    .sig-name {
      font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;;
      font-size: 13px;
      font-weight: 700;
      color: #111;
    }

    .sig-role {
      font-size: 11px;
      color: #444;
    }

    .auth-code {
      font-size: 7.5px;
      color: #444;
      text-align: right;
      max-width: 200px;
      line-height: 1.55;
      font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;;
    }

    .card-qr-code {
      display: flex;
      flex-flow: column;
      align-items: flex-end;
      justify-content: flex-end;
      gap: 4px;
    }

    .auth-code {
      font-size: 7px;
      color: #444;
      text-align: right;
      max-width: 300px;
      line-height: 1.5;
      margin-top: 10px;
    }
  </style>
</head>

<body>
  <div class="cert">
    <div class="band"></div>
    <div class="content">
      <div class="title">Certificado</div>
      <p class="intro">O Centro Acadêmico de Medicina de Maringá certifica que</p>
      <div class="name-box"><span>${data.name}</span></div>
      <p class="body-text">
        participou como <strong>${getFunctions(data.functions) ?? "Participante"}</strong> ${getArticle(data.nameEvent)}
        <strong>${data.nameEvent}</strong> inscrita no CNPJ/MF nº 21.990.297/0001-50,
      de <strong>${dates}</strong>, perfazendo a carga horária de <strong>${data.hours} horas</strong>.
      </p>
      <div class="registry-box"></div>
      <div class="sig-center">
        <div class="sig-person">
          <div class="sig-line"></div>
          <span class="sig-name">Laura Yanaze</span>
          <span class="sig-role">Presidente do CAMEM</span>
        </div>
        <div class="sig-person">
          <div class="sig-line"></div>
          <span class="sig-name">Pedro Brites</span>
          <span class="sig-role">Presidente da AAAREY</span>
        </div>
      </div>
      <div class="signatures">
        <div>
          <span class="sig-realizacao">Realização:</span>
          <div class="sig-camem-label">
            <img class="sig-logo" src="${logoBase64}" />
          </div>
        </div>

        <div class="card-qr-code">
          <div id="qrcode" class="qr-code"></div>
          <p class="auth-code">
            Código de Autenticidade: <strong>${data.keyCertificate}</strong>
          </p>
          <p class="auth-code">
            Valide em: <strong>${process.env.NEXT_PUBLIC_UI_URL}/certificates-validate/${data.keyCertificate}</strong>
          </p>
        </div>
      </div>
    </div>
    <div class="band"></div>
  </div>
</body>
<script>
  new QRCode(document.getElementById("qrcode"), {
    text: "${data.keyCertificate ?? ''}",
    width: 100,
    height: 100,
    colorDark: "#111111",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
</script>

  </html>`;

  const blob  = new Blob([html], { type: "text/html;charset=utf-8" });
  const url   = URL.createObjectURL(blob);
  const link  = document.createElement("a");
  link.href   = url;
  link.download = `certificado-${data.nameEvent.toLowerCase().replace(/\s+/g, "-")}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const MyCertificateCard = ({ name, nameEvent, startDate, endDate, hours, functionName, keyCertificate, functions, onDownload }: TCertificateCard) => {
  const handleDownload = () => {
    downloadCertificate({ name, nameEvent, startDate, endDate, hours, functionName, keyCertificate, functions });
    onDownload?.();
  };

  
  const getFunctions = (functions: string[]): string => {
    if(functions.length > 1) {
      const newFunctions = functions.slice(1, functions.length);
      if(newFunctions.length > 1) {
        const functionsAll = functions.slice(0, functions.length - 1);
        return `${functionsAll.join(", ")} e ${functions[functions.length - 1]}`;
      } else {
        return `${functions[0]} e ${newFunctions[0]}`;
      }
    }
    else {
      return `${functions[0]}`;
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-[#2a8e84] dark:hover:border-[#2a8e84]/50 hover:shadow-lg hover:shadow-[#1f544b]/5 transition-all duration-300">

      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#2a8e84]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative px-5 pt-5 pb-4 bg-linear-to-br from-[#f2faf9] to-white dark:from-[#1f544b]/10 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-[#1f544b]/10 dark:bg-[#1f544b]/20 flex items-center justify-center text-[#1f544b] dark:text-brand-300">
          <MdWorkspacePremium />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#2a8e84] mb-2">Certificado</p>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug pr-10 line-clamp-2">{nameEvent}</h3>
      </div>

      <div className="flex flex-col gap-3 px-5 py-4 flex-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#f2faf9] dark:bg-[#1f544b]/10 flex items-center justify-center shrink-0 text-xs font-bold text-[#1f544b] dark:text-brand-300 border border-[#c0e9e4] dark:border-[#1f544b]/30">
            {name?.slice(0, 1).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{name}</span>
        </div>
        {functions?.length > 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-500 pl-9">{getFunctions(functions)}</p>
        )}
        <div className="h-px bg-gray-100 dark:bg-gray-800" />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <BiCalendar size={20} />
            <span>
              {maskDate(startDate)}
              {endDate ? ` — ${maskDate(endDate)}` : ""}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <FiClock size={20} />
            <span>{hours}h de carga horária</span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <button
          onClick={handleDownload}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1f544b] text-white text-xs font-semibold hover:bg-[#174039] active:scale-[0.98] transition-all duration-150 shadow-md shadow-[#1f544b]/20"
        >
          <BiDownload size={20} />
          Baixar certificado
        </button>
      </div>
    </div>
  );
};