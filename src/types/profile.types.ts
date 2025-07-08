export type ProfileType = {
    id: number;
    rol: "admin" | "jugador";
    createdAt: string;
    nombre: string;
    email: string;
    dni: string;
    show_is_company_modal: boolean;
    provincia: string;
};
export type CompanyType = {
    id: number
    name: string
    address: string
    phone: string
    email: string
    coin_name: string
}
export type Company = {
    user: number
    company: number
    Company: CompanyType
}

export type Session = {
    usuario: ProfileType
    user_company: Company
}
