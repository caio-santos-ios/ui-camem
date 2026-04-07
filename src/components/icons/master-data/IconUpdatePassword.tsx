import { FaLock } from "react-icons/fa";

type TProp = {
    action: string; 
    obj?: any;
    getObj: (action: string, obj?: any) => void;
}

export const IconUpdatePassword = ({ obj, getObj, action }: TProp) => {
    return (
        <div title="Alterar Senha" onClick={() => getObj(obj, action)} className="cursor-pointer text-blue-400 hover:text-blue-500">
            <FaLock />
        </div>
    );
};