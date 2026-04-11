import { MdCampaign } from "react-icons/md";

type TProp = {
    action: string; 
    obj?: any;
    getObj: (action: string, obj?: any) => void;
}

export const IconEventPublish = ({ obj, getObj, action }: TProp) => {
    return (
        <div title="Publicar Evento" onClick={() => getObj(obj, action)} className="cursor-pointer text-blue-400 hover:text-blue-500">
            <MdCampaign size={20} />
        </div>
    );
};