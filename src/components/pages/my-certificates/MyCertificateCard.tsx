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
  html: string;
  origin: "automatic" | "manual"
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
  html: string;
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

  const blob  = new Blob([data.html], { type: "text/html;charset=utf-8" });
  const url   = URL.createObjectURL(blob);
  const link  = document.createElement("a");
  link.href   = url;
  link.download = `certificado-${data.nameEvent.toLowerCase().replace(/\s+/g, "-")}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const MyCertificateCard = ({ name, nameEvent, startDate, endDate, hours, functionName, keyCertificate, functions, onDownload, html, origin }: TCertificateCard) => {
  const handleDownload = () => {
    downloadCertificate({ name, nameEvent, startDate, endDate, hours, functionName, keyCertificate, functions, html });
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
        {
          origin == "automatic" ? (
            <button
              onClick={handleDownload}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1f544b] text-white text-xs font-semibold hover:bg-[#174039] active:scale-[0.98] transition-all duration-150 shadow-md shadow-[#1f544b]/20"
            >
              <BiDownload size={20} />
              Baixar certificado
            </button>
          ) : (
            <a target="_blank" href={html}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1f544b] text-white text-xs font-semibold hover:bg-[#174039] active:scale-[0.98] transition-all duration-150 shadow-md shadow-[#1f544b]/20">
              <BiDownload size={20} />
              Baixar certificado
            </a>
          )
        }
      </div>
    </div>
  );
};