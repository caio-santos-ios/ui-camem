export type TEvent = {
    id?: string;
    title: string;
    description: string;
    startDate: any;
    endDate: any;
}

export const ResetEvent: TEvent = {
    id: "",
    title: "",
    description: "",
    startDate: null,
    endDate: null,
}
export type TParticipantFunction = {
    name: string;
    hours: number;
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