"use client";

import Button from "@/components/ui/button/Button";
import { TEventParticipant, TParticipantFunction } from "@/types/event/event.type";
import { useState } from "react";

type Props = {
    participant: TEventParticipant;
    onSave: (updated: TEventParticipant) => void;
    open: boolean;
    onToggle: () => void;
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

    const SaveIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
    </svg>
    );

export const EventParticipantCardPresence = ({ participant, onSave, open, onToggle }: Props) => {
    const [functions, setFunctions] = useState<TParticipantFunction[]>(participant.functions);
    const [dirty, setDirty] = useState(false);

    const totalPresent = functions.filter((f) => f.isPresence).length;
    const total = functions.length;

    const togglePresence = (index: number) => {
        setFunctions((prev) => prev.map((f, i) => i === index ? { ...f, isPresence: !f.isPresence } : f));
        setDirty(true);
    };

    const updateNotes = (index: number, value: string) => {
        setFunctions((prev) => prev.map((f, i) => i === index ? { ...f, notesPresence: value } : f));
        setDirty(true);
    };

    const handleSave = () => {
        onSave({ ...participant, functions });
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

    return (
        <div className={`mb-4 rounded-xl transition-all duration-200 border ${open ? "border-brand-500/60 dark:border-brand-600/50" : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700" } bg-white dark:bg-gray-900 overflow-hidden`}>
            <button type="button" onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-3.5 text-left group">
                <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 ring-1 ring-teal-200 dark:ring-teal-800">
                    {getInitials(participant.name)}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight truncate">{participant.name}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                        {total === 0 ? "Sem funções" : `${totalPresent} de ${total} presença${total > 1 ? "s" : ""}`}
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

                {total === 0 && (
                    <p className="text-xs text-gray-400 dark:text-gray-600 text-center py-2">Nenhuma função cadastrada.</p>
                )}

                <div className="flex flex-col gap-2.5">
                    {functions.map((fn, index) => (
                    <div key={index} className="rounded-lg border border-gray-100 dark:border-gray-800 overflow-hidden">

                        <div className="flex items-center justify-between gap-3 px-3 py-2.5 bg-gray-50 dark:bg-gray-800/50">
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{fn.name}</p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500">{fn.hours}h</p>
                            </div>

                            <button
                                type="button"
                                onClick={() => togglePresence(index)}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-150 shrink-0
                                ${fn.isPresence
                                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                    : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${fn.isPresence ? "bg-white" : "bg-gray-400 dark:bg-gray-500"}`} />
                                {fn.isPresence ? "Presente" : "Ausente"}
                            </button>
                        </div>

                        <div className="px-3 py-2 bg-white dark:bg-gray-900">
                            <textarea
                                value={fn.notesPresence ?? ""}
                                onChange={(e) => updateNotes(index, e.target.value)}
                                placeholder="Observações"
                                rows={2}
                                className="w-full text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-brand-500 transition"
                            />
                        </div>
                    </div>
                    ))}
                </div>

                {dirty && (
                    <div className="flex justify-end mt-3">
                        <Button size="sm" variant="primary" onClick={handleSave}>Salvar apontamentos</Button>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};