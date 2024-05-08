export interface LoginCredentials {
    email: string,
    password: string
}

export interface RegisterPayload {
    email: string,
    username: string,
    password: string,
    confirmPassword: string
}