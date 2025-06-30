export type ProfileType = {
    id: number;
    rol: "admin" | "jugador";
    createdAt: string;
    nombre: string;
    email: string;
};

export type Company = {
    user: number
    company: number
    Company: {
        id: number
        name: string
        address: string
    }
}

export type Session = {
    usuario: ProfileType
    user_company: Company
}
