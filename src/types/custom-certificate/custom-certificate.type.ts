export type TCustomCertificate = {
    id?: string;
    name: string;
    html: string;
    bodyText: string;
    signer1Name: string;
    signer1Role: string;
    signer1Photo: string;
    signer2Name: string;
    signer2Role: string;
    signer2Photo: string;
    signer3Name: string;
    signer3Role: string;
    signer3Photo: string;
    registryText: string;
}

export const ResetCustomCertificate: TCustomCertificate = {
    id: "",
    name: "",
    html: "",
    bodyText: "",
    signer1Name: "",
    signer1Role: "",
    signer1Photo: "",
    signer2Name: "",
    signer2Role: "",
    signer2Photo: "",
    signer3Name: "",
    signer3Role: "",
    signer3Photo: "",
    registryText: "",
}