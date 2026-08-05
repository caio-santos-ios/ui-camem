export type TCertificateManual = {
    id?: string;
    userId: string;

    // EVENT
    nameEvent: string;
    startDateEvent: any;
    endDateEvent: any;
    registerBookNumberEvent: string;
    registerFolderNumberEvent: string;
    keyCertificateEvent: string;

    // EVENT PARTICIPANT
    nameParticipantEvent: string;
    
    // EVENT PARTICIPANT FUNCTION
    participantFunction: TCertificateManualParticipantFunction[]
}

export type TCertificateManualParticipantFunction = {
    name: string;
    hours: string;
}

export const ResetCertificateManual: TCertificateManual = {
    id: "",
    userId: "",
    nameEvent: "",
    startDateEvent: null,
    endDateEvent: null,
    registerBookNumberEvent: "",
    registerFolderNumberEvent: "",
    keyCertificateEvent: "",
    nameParticipantEvent: "",
    participantFunction: [
        {
            name: "",
            hours: ""
        }
    ]
}