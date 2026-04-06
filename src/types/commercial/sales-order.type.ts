export type TServiceOrder = {
    id: string;
    code: string;
    customerId: string;
    customerName: string;
    status: string;
    openingDate: any,
    forecasDate: any,
    endDate: any,
    priority: "Baixa" | "Normal" | "Alta" | "Urgente";
    description: string;
    notes: string;
}

export const ResetServiceOrder: TServiceOrder = {
    id: "",
    code: "",
    customerId: "",
    customerName: "",
    status: "Em Aberto",
    openingDate: null,
    forecasDate: null,
    endDate: null,
    priority: "Normal",
    description: "",
    notes: ""
}