"use client";

import Button from "@/components/ui/button/Button";
import { TEventParticipant, TParticipantFunction } from "@/types/event/event.type";
import { useEffect, useState } from "react";

type Props = {
    participant: TEventParticipant;
    onSave: (updated: TEventParticipant) => void;
    open: boolean;
    onToggle: () => void;
    setValue: any;
    getValues: any;
    watch: any;
};

const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const ChevronDown = ({ open }: { open: boolean }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
        <polyline points="6 9 12 15 18 9" />
    </svg>
    );

export const EventParticipantCardPresence = ({ participant, onSave, open, onToggle, setValue, watch, getValues }: Props) => {
    const [functions, setFunctions] = useState<TParticipantFunction[]>([]);
    const [dirty, setDirty] = useState(false);

    const totalPresent = functions.filter((f) => f.isPresence).length;
    const total = functions.length;
    const isPresence = watch("isPresence");
    const notesPresence = watch("notesPresence");

    const togglePresence = (id: string) => {
        setDirty(true);
        console.log(id)
        setValue("id", id)
        setValue("isPresence", !isPresence)
    };

    const updateNotes = (index: number, value: string) => {
        setFunctions((prev) => prev.map((f, i) => i === index ? { ...f, notesPresence: value } : f));
        setDirty(true);
    };

    const handleSave = () => {
        onSave({ ...getValues() });
        setDirty(false);
    };

    const statusColor =
        total === 0 ? "" :
        totalPresent === total ? "text-emerald-500 dark:text-emerald-400" :
        totalPresent === 0 ? "text-red-400 dark:text-red-400" :
        "text-amber-500 dark:text-amber-400";

    const statusLabel =
        total === 0 ? "—" :
        totalPresent === total ? "Completo" :
        totalPresent === 0 ? "Ausente" : "Parcial";

    useEffect(() => {
        setValue("notesPresence", participant.notesPresence);
        setValue("isPresence", participant.isPresence);
    }, [participant.notesPresence, participant.isPresence]);

    return (
        <div className={`mb-4 rounded-xl transition-all duration-200 border ${open ? "border-brand-500/60 dark:border-brand-600/50" : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700" } bg-white dark:bg-gray-900 overflow-hidden`}>
            <button type="button" onClick={() => { 
                    onToggle();
                    console.log(participant.functionId)
                    setValue("functionId", participant.functionId);
                }} className="w-full flex items-center gap-3 px-4 py-3.5 text-left group">
                <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 ring-1 ring-teal-200 dark:ring-teal-800">
                    {getInitials(participant.name)}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight truncate">{participant.name}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                        {participant.functionName}
                    </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {total > 0 && (
                        <span className={`text-[11px] font-semibold ${statusColor}`}>{statusLabel}</span>
                    )}
                    <span className="text-gray-400 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                        <ChevronDown open={open} />
                    </span>
                </div>
            </button>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${open ? "max-h-[900px]" : "max-h-0"}`}>
                <div className="px-4 pb-4 pt-0">
                    <div className="h-px bg-gray-100 dark:bg-gray-800 mb-4" />

                    <div className="flex flex-col gap-2.5">
                        <div className="rounded-lg border border-gray-100 dark:border-gray-800 overflow-hidden">

                            <div className="flex items-center justify-between gap-3 px-3 py-2.5 bg-gray-50 dark:bg-gray-800/50">
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{participant.functionName}</p>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500">{participant.hours}h</p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => togglePresence(participant.id!)}
                                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-150 shrink-0
                                    ${isPresence
                                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                        : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${isPresence ? "bg-white" : "bg-gray-400 dark:bg-gray-500"}`} />
                                    {isPresence ? "Presente" : "Ausente"}
                                </button>
                            </div>

                            <div className="px-3 py-2 bg-white dark:bg-gray-900">
                                <textarea
                                    value={notesPresence}
                                    onChange={(e) => {
                                        setValue("notesPresence", e.target.value);
                                    }}
                                    placeholder="Observações"
                                    rows={2}
                                    className="w-full text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-brand-500 transition"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-3">
                        <Button size="sm" variant="primary" onClick={handleSave}>Salvar apontamentos</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};