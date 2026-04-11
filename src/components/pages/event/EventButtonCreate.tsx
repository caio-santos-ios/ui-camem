"use client";

import Button from "@/components/ui/button/Button"
import { eventModalAtom } from "@/jotai/event/event.jotai";
import { permissionCreate } from "@/utils/permission.util";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

const module = "F";
const routine = "F1";

export const EventButtonCreate = () => {
    const [_, setModal] = useAtom(eventModalAtom);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        setHasPermission(permissionCreate(module, routine));
    }, []);

    if (!hasPermission) return null;

    return (
        <Button onClick={() => setModal(true)} type="submit" className="" size="sm">
            Adicionar
        </Button>
    );
}