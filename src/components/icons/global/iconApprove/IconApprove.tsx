import { MdCheckCircle } from "react-icons/md";

type TProp = {
    action: string; 
    obj?: any;
    getObj: (action: string, obj?: any) => void;
}

export const IconApprove = ({ obj, getObj, action }: TProp) => {
    return (
        <div title="Aprovar" onClick={() => getObj(obj, action)} className="cursor-pointer text-green-400 hover:text-green-500">
            <MdCheckCircle />
        </div>
    );
};