import { ResetCustomCertificate, TCustomCertificate } from "@/types/custom-certificate/custom-certificate.type";
import { atom } from "jotai";

export const customCertificateModalAtom = atom<boolean>(false);
export const customCertificateAtom = atom<TCustomCertificate>(ResetCustomCertificate

);