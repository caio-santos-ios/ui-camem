import { RiAwardLine } from "react-icons/ri";

type TProp = {
    action: string; 
    obj?: any;
    getObj: (action: string, obj?: any) => void;
}

export const IconCertificateManual = ({ obj, getObj, action }: TProp) => {
    return (
        <div title="Anexar Certificado" onClick={() => getObj(obj, action)} className="cursor-pointer text-lime-400 hover:text-lime-500">
            <RiAwardLine size={20} />
        </div>
    );
};