export interface User {
    id: string;
    name: string;
    role: string;
}

export interface LoginRequest {
    login: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}
