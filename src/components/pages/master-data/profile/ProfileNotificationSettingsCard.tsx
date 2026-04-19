"use client";

import { useEffect, useState } from "react";
import { BsBell, BsEnvelope } from "react-icons/bs";
import Switch from "@/components/form/Switch";
import { ResetUserSettingNotification, TUserSettingNotification } from "@/types/master-data/user.type";
import Button from "@/components/ui/button/Button";

const items = [
    { pushKey: "newEventPush",       mailKey: "newEventMail",       label: "Novo evento",                   desc: "Quando um novo evento for publicado"           },
    { pushKey: "newCertificatePush", mailKey: "newCertificateMail", label: "Novo certificado",               desc: "Quando um certificado for emitido para você"   },
    { pushKey: "newUserPush",        mailKey: "newUserMail",        label: "Usuário aguardando aprovação",   desc: "Quando um novo usuário precisar de aprovação"  },
] as const;

type Props = {
    defaultValues?: TUserSettingNotification;
    onSave?: (values: TUserSettingNotification) => void;
};

export const ProfileNotificationSettingsCard = ({ defaultValues, onSave }: Props) => {
    const [settings, setSettings] = useState<TUserSettingNotification>(defaultValues ?? ResetUserSettingNotification);
    const [dirty, setDirty]       = useState(false);

    const toggle = (key: keyof TUserSettingNotification) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
        setDirty(true);
    };

    const handleSave = () => {
        onSave?.(settings);
        setDirty(false);
    };

    useEffect(() => {
        if(defaultValues) setSettings(defaultValues);
    }, [defaultValues]);

    return (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">

            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Preferências de notificação</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Escolha como deseja ser notificado para cada evento.</p>
            </div>

            <div className="px-5 py-4">

                <div className="grid grid-cols-6 items-center gap-x-6 mb-3 px-1">
                    <div className="col-span-4" />
                    <div className="col-span-1 flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500">
                        <BsBell size={13} />
                        Push
                    </div>
                    <div className="col-span-1 flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500">
                        <BsEnvelope size={13} />
                        E-mail
                    </div>
                </div>

                <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
                    {items.map((item) => (
                        <div key={item.pushKey} className="grid grid-cols-6 items-center gap-x-6 py-3.5 px-1">
                            <div className="col-span-4">
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight">{item.label}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.desc}</p>
                            </div>

                            <div className="col-span-1">
                                <Switch
                                    key={`${item.pushKey}-${settings[item.pushKey]}`}
                                    label=""
                                    defaultChecked={settings[item.pushKey]}
                                    onChange={() => toggle(item.pushKey)}
                                />
                            </div>

                            <div className="col-span-1">
                                <Switch
                                    key={`${item.mailKey}-${settings[item.mailKey]}`}
                                    label=""
                                    defaultChecked={settings[item.mailKey]}
                                    onChange={() => toggle(item.mailKey)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {dirty && (
                <div className="px-5 pb-4 flex justify-end">
                    <Button size="sm" variant="primary" onClick={handleSave}>
                        Salvar preferências
                    </Button>
                </div>
            )}
        </div>
    );
};