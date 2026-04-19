"use client";

import { BsImage } from "react-icons/bs";

type Props = {
    value?: string;
};

export const CoverPhoto = ({ value }: Props) => {
    return (
        <div
            className="relative w-full overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-800 transition-all duration-200"
            style={{ height: "180px" }}
        >
            {value ? (
                <>
                    <img src={value} alt="Foto de capa" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                        <span className="px-2 py-0.5 rounded-full bg-black/40 text-white text-[10px] font-semibold backdrop-blur-sm">
                            Foto de capa
                        </span>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 bg-gray-50 dark:bg-gray-900">
                    <BsImage size={28} className="text-gray-300 dark:text-gray-600" />
                    <p className="text-xs text-gray-400 dark:text-gray-600">Sem foto de capa</p>
                </div>
            )}
        </div>
    );
};