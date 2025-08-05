export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    companyName: string;
}

export interface RegisterRequest {
    nombre: string;
    email: string;
    password: string;
    companyName: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}
