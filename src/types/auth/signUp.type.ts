export type TSignUp = {
    name: string,
    email: string;
    role: "Student" | "Teacher" | "Director" | "Coordinator";
    ra: string;
    password: string;
    cpf: string;
    privacyPolicy: boolean;
    typeAccess: boolean; // "CPF" | "RA"
    profileUserId: string;
}

export const ResetSignUp: TSignUp = {
    name: "",
    email: "",
    role: "Student",
    ra: "",
    password: "",
    privacyPolicy: false,
    cpf: "",
    typeAccess: true,
    profileUserId: ""
} 