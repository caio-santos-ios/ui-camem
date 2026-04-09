"use client";

import { maskDate } from "@/utils/mask.util";
import { ReactNode } from "react";

type TProps = {
    id: string;
    title: string;
    description: string;
    participants: string[];
    startDate: string;
    endDate?: string;
    actions: ReactNode;
};

export const EventCard = ({ id, title, description, participants, startDate, endDate, actions }: TProps) => {
    const visibleParticipants = participants.slice(0, 3);
    const remaining = participants.length - visibleParticipants.length;

    const getInitials = (event: any) => event.name.split(" ").map((n: any) => n[0]).slice(0, 2).join("").toUpperCase();

    const colors = [
        "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
        "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    ];

    return (
        <div className={`group flex flex-col justify-between gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-200 hover:border-brand-500 hover:shadow-sm`}>
            <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-1">{title}</h3>
                    <div className="flex flex-col items-end">
                        <p className="shrink-0 text-xs text-gray-400 dark:text-gray-500 mt-0.5">Inicio: {maskDate(startDate)}</p>
                        {endDate && ( <p className="shrink-0 text-xs text-gray-400 dark:text-gray-500 mt-0.5">Fim: {maskDate(endDate)}</p>)}
                    </div>
                </div>

                <div className="text-xs h-60 text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-15 prose prose-xs dark:prose-invert max-w-none
                    [&_strong]:font-semibold [&_em]:italic [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4"
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            </div>
            
            <div>
                <div className="h-px bg-gray-100 dark:bg-gray-800" />
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center -space-x-2">
                        {visibleParticipants.map((name, i) => (
                            <div
                            key={i}
                            title={name}
                            className={`w-7 h-7 mr-1 rounded-full flex items-center justify-center text-[10px] font-semibold ring-2 ring-white dark:ring-gray-900 ${colors[i % colors.length]}`}
                            >
                            {getInitials(name)}
                            </div>
                        ))}

                        {remaining > 0 && (
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold ring-2 ring-white dark:ring-gray-900 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                +{remaining}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between w-full">
                        <span className="text-xs text-gray-400 dark:text-gray-500">{participants.length} participante{participants.length !== 1 ? "s" : ""}</span>
                        {actions}
                    </div>
                </div>
            </div>
        </div>
    );
};