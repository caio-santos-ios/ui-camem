import { FaCheckDouble } from "react-icons/fa";
import { MdBolt, MdCheckCircle, MdGavel } from "react-icons/md";

type TProp = {
    action: string; 
    obj?: any;
    getObj: (action: string, obj?: any) => void;
}

export const IconForceApprove = ({ obj, getObj, action }: TProp) => {
    return (
        <div title="Forçar Aprovação" onClick={() => getObj(obj, action)} className="cursor-pointer text-green-400 hover:text-green-500">
            <MdBolt size={20} />
        </div>
    );
};