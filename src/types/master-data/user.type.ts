export type TUser = {
    id: string;
    name: string;
    email: string;
    profileUserId: string;
    password: string;
    statusAccess: string;
    cpf: string;
    ra: string;
    blocked: boolean;
}

export const ResetUser: TUser = {
    id: "",
    email: "",
    name: "",
    profileUserId: "",
    password: "",
    statusAccess: "",
    cpf: "",
    ra: "",
    blocked: false
}


export type TUserResetPassword = {
    id: string;
    password: string;
    newPassword: string;
    confirmPassword: string;
}

export const ResetUserResetPassword: TUserResetPassword = {
    id: "",
    password: "",
    newPassword: "",
    confirmPassword: ""
}

export type TUserLogged = {
    photo: string;
    name: string;
    email: string;
    id: string;
    admin: boolean;
    master: boolean;
    role: string;
}

export const ResetUserLogged: TUserLogged = {
    photo: "",
    name: "",
    email: "",
    id: "",
    admin: false,
    master: false,
    role: ""
}

export type TUserProfile = {
    id?: string;
    photo: any;
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
}

export const ResetUserProfile: TUserProfile = {
    id: "",
    photo: "",
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
}