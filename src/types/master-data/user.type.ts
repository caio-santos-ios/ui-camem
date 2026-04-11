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
    role: string;
    photo: string;
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
    blocked: false,
    photo: "",
    role: ""
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

export type TUserProfile = {
    id: string;
    name: string;
    email: string;
    password: string;
    cpf: string;
    ra: string;
    photo: string;
}

export const ResetUserProfile: TUserProfile = {
    id: "",
    email: "",
    name: "",
    password: "",
    cpf: "",
    ra: "",
    photo: ""
}

export type TUserLogged = {
    id: string;
    name: string;
    email: string;
    photo: string;
    role: string;
    master: boolean;
    admin: boolean;
    statusAccess: string;
    blocked: boolean;
    cpf: string;
    ra: string;
}

export const ResetUserLogged: TUserLogged = {
    id: "",
    email: "",
    name: "",
    photo: "",
    role: "",
    master: false,
    admin: false,
    statusAccess: "",
    blocked: false,
    cpf: "",
    ra: ""
}