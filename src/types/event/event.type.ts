export type TEvent = {
    id?: string;
    title: string;
    description: string;
    startDate: any;
    endDate: any;
    status: "Rascunho" | "Publicado";
    photo: string;
}

export const ResetEvent: TEvent = {
    id: "",
    title: "",
    description: "",
    startDate: null,
    endDate: null,
    status: "Rascunho",
    photo: ""
}

export type TParticipantFunction = {
    id?: string;
    name: string;
    eventId: string;
    eventParticipantId: string;
    hours: number;
    isPresence: boolean;
    notesPresence: string;
};

export const ResetParticipantFunction: TParticipantFunction = {
    id: "",
    name: "",
    eventId: "",
    eventParticipantId: "",
    hours: 0,
    isPresence: true,
    notesPresence: ""
}

export type TEventParticipant = {
    id?: string;
    name: string;
    functions: TParticipantFunction[];
    userId: string;
    userName: string;
    eventId: string;
    description: string;
    functionName: string;
    functionId: string;
    hours: number;
    isPresence: boolean;
    notesPresence: string;
};

export const ResetEventParticipant: TEventParticipant = {
    id: "",
    name: "",
    functions: [],
    userId: "",
    userName: "",
    eventId: "",
    description: "",
    functionName: "",
    functionId: "",
    hours: 0,
    isPresence: true,
    notesPresence: ""
};