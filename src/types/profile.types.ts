export type ProfileType = {
    id: number;
    rol: "admin" | "jugador";
    createdAt: string;
    nombre: string;
    email: string;
    user_company: {
        user: number
        company: number
        Company: {
            id: number
            name: string
            address: string
        }
    }
};
