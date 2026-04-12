"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/service/api.service";
import { maskDate } from "@/utils/mask.util";
import Link from "next/link";

type TCertificate = {
    name: string;
    nameEvent: string;
    startDate: string;
    endDate?: string | null;
    hours: number;
    functionName?: string;
    keyCertificate: string;
};

    const CheckIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
    );

    const XIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
    );

    const CalendarIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
    );

    const ClockIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
    );

    const UserIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
    );

    const KeyIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
    );

export default function CertificateValidationPage() {
    const params = useParams();
    const keyCertificate = params?.keyCertificate as string;

    const [certificate, setCertificate] = useState<TCertificate | null>(null);
    const [loading, setLoading]         = useState(true);
    const [valid, setValid]             = useState<boolean | null>(null);

    useEffect(() => {
        if (!keyCertificate) return;
        const validate = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/certificates/validate/${keyCertificate}`);
                const result = data?.result?.data;
                if (result) {
                setCertificate(result);
                setValid(true);
                } else {
                setValid(false);
                }
            } catch {
                setValid(false);
            } finally {
                setLoading(false);
            }
        };
        validate();
    }, [keyCertificate]);

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 overflow-x-hidden">

            <div
                className="pointer-events-none fixed inset-0 -z-10 opacity-30 dark:opacity-20"
                style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(31,84,75,0.15) 0%, transparent 70%)" }}
            />

            <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">

                {loading && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 rounded-full border-2 border-[#1f544b]/20 border-t-[#1f544b] animate-spin" />
                        <p className="text-sm text-gray-400">Verificando autenticidade...</p>
                    </div>
                )}

                {!loading && valid === false && (
                    <div className="w-full max-w-md flex flex-col items-center text-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 dark:text-red-400">
                        <XIcon />
                        </div>
                        <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Certificado inválido
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            Não foi possível encontrar um certificado com este código de autenticidade. Verifique se o código está correto e tente novamente.
                        </p>
                        </div>

                        <div className="w-full p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                        <div className="flex items-center gap-2 text-xs text-red-500 dark:text-red-400">
                            <KeyIcon />
                            <span className="font-mono break-all">{keyCertificate}</span>
                        </div>
                        </div>

                        <Link
                        href="/home/certificados"
                        className="text-sm text-[#1f544b] dark:text-brand-300 font-semibold hover:underline"
                        >
                        ← Voltar
                        </Link>
                    </div>
                )}

                {!loading && valid === true && certificate && (
                    <div className="w-full max-w-lg flex flex-col gap-6">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
                                <CheckIcon />
                            </div>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wide mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Certificado autêntico
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {certificate.nameEvent}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Este certificado foi emitido pelo CAMEM e sua autenticidade foi confirmada.
                            </p>
                        </div>
                        </div>

                        <div className="relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
                            <div className="h-1.5 bg-linear-to-r from-[#1f544b] to-[#2a8e84]" />

                            <div className="p-6 flex flex-col gap-4">
                                <p className="text-xs font-bold uppercase tracking-widest text-[#2a8e84]">Dados do certificado</p>

                                <div className="flex flex-col gap-3">

                                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                    <div className="mt-0.5 text-[#2a8e84]"><UserIcon /></div>
                                    <div>
                                    <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">Participante</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{certificate.name}</p>
                                    {certificate.functionName && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{certificate.functionName}</p>
                                    )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                    <div className="mt-0.5 text-[#2a8e84]"><CalendarIcon /></div>
                                    <div>
                                    <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">Período</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {maskDate(certificate.startDate)}
                                        {certificate.endDate ? ` — ${maskDate(certificate.endDate)}` : ""}
                                    </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                    <div className="mt-0.5 text-[#2a8e84]"><ClockIcon /></div>
                                    <div>
                                    <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">Carga horária</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{certificate.hours} horas</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                    <div className="mt-0.5 text-[#2a8e84]"><KeyIcon /></div>
                                    <div className="min-w-0">
                                    <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">Código de autenticidade</p>
                                    <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">{certificate.keyCertificate}</p>
                                    </div>
                                </div>

                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-gray-400 dark:text-gray-600">
                                Emitido pelo Centro Acadêmico de Medicina de Maringá · CAMEM
                            </p>
                        </div>
                        <Link
                        href="/home/certificados"
                        className="text-sm text-[#1f544b] dark:text-brand-300 font-semibold hover:underline m-auto">
                        ← Voltar
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}