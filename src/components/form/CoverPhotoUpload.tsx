"use client";

import { useRef, useState } from "react";
import { BsImage } from "react-icons/bs";
import { BiUpload } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";

type Props = {
    value?: string;
    onChange?: (file: File) => void;
    disabled?: boolean;
    removeImg?: () => void;
};

export const CoverPhotoUpload = ({ value, onChange, removeImg, disabled }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(value ?? null);
    const [dragging, setDragging] = useState(false);

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) return;
        const url = URL.createObjectURL(file);
        setPreview(url);
        onChange?.(file);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        if (disabled) return;
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        if (inputRef.current) inputRef.current.value = "";
        if (removeImg) removeImg();
    };

    return (
        <div
            onClick={() => !disabled && !preview && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`
                relative w-full overflow-hidden rounded-xl border-2 transition-all duration-200
                ${preview
                    ? "border-transparent"
                    : dragging
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-900/10"
                        : disabled
                            ? "border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 cursor-not-allowed"
                            : "border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 cursor-pointer"
                }
            `}
            style={{ height: "180px" }}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={disabled}
                onChange={handleChange}
            />

            {preview ? (
                <>
                    <img src={preview} alt="Foto de capa" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                    {!disabled && (
                        <div className="absolute bottom-3 right-3 flex gap-2">
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-gray-900/90 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900 transition-colors shadow-sm backdrop-blur-sm"
                            >
                                <BiUpload size={14} />
                                Trocar
                            </button>
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/90 text-xs font-semibold text-white hover:bg-red-500 transition-colors shadow-sm backdrop-blur-sm"
                            >
                                <RiDeleteBinLine size={14} />
                                Remover
                            </button>
                        </div>
                    )}

                    <div className="absolute top-3 left-3">
                        <span className="px-2 py-0.5 rounded-full bg-black/40 text-white text-[10px] font-semibold backdrop-blur-sm">
                            Foto de capa
                        </span>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 px-4 text-center">
                    <BsImage size={32} className={`transition-colors ${dragging ? "text-brand-500" : "text-gray-300 dark:text-gray-600"}`} />
                    <div>
                        <p className={`text-sm font-medium transition-colors ${dragging ? "text-brand-600 dark:text-brand-400" : "text-gray-500 dark:text-gray-400"}`}>
                            {dragging ? "Solte para adicionar" : disabled ? "Sem foto de capa" : "Clique ou arraste uma imagem"}
                        </p>
                        {!disabled && !dragging && (
                            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                                PNG, JPG ou WEBP · Recomendado 1200×400px
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};