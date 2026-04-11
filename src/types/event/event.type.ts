export type TEvent = {
    id?: string;
    title: string;
    description: string;
    startDate: any;
    endDate: any;
    status: "Rascunho" | "Publicado";
}

export const ResetEvent: TEvent = {
    id: "",
    title: "",
    description: "",
    startDate: null,
    endDate: null,
    status: "Rascunho"
}
export type TParticipantFunction = {
    name: string;
    hours: number;
    isPresence: boolean;
    notesPresence: string;
};

export type TEventParticipant = {
    id?: string;
    name: string;
    functions: TParticipantFunction[];
    userId: string;
    userName: string;
    eventId: string;
    description: string;
};

export const ResetEventParticipant: TEventParticipant = {
    id: "",
    name: "",
    functions: [],
    userId: "",
    userName: "",
    eventId: "",
    description: ""
};