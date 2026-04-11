import { MdFactCheck } from "react-icons/md";

type TProp = {
    action: string; 
    obj?: any;
    getObj: (action: string, obj?: any) => void;
}

export const IconEventPresence = ({ obj, getObj, action }: TProp) => {
    return (
        <div title="Registrar Presença" onClick={() => getObj(obj, action)} className="cursor-pointer text-green-400 hover:text-green-500">
            <MdFactCheck size={17} />
        </div>
    );
};