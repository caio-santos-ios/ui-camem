"use client";

import Button from "@/components/ui/button/Button"
import { permissionCreate } from "@/utils/permission.util";
import Link from "next/link";
import { useEffect, useState } from "react";

const module = "D";
const routine = "D1";

export const CustomCertificateButtonCreate = () => {
    const [hasPermission, setHasPermission] = useState(false);
    
    useEffect(() => {
        setHasPermission(permissionCreate(module, routine));
    }, []);

    if (!hasPermission) return null;
    
    return (
        <Link href="/custom-certificates/create">
            <Button type="submit" className="" size="sm">Adicionar</Button>
        </Link>
    ) 
}