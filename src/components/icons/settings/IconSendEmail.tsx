import { MdSend } from "react-icons/md";

type TProp = {
    action: string; 
    obj?: any;
    getObj: (action: string, obj?: any) => void;
}

export const IconSendEmail = ({ obj, getObj, action }: TProp) => {
    return (
        <div title="Enviar e-mail" onClick={() => getObj(obj, action)} className="cursor-pointer text-blue-400 hover:text-blue-500">
            <MdSend />
        </div>
    );
};