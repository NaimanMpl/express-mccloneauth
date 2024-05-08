declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number,
            JWT_SECRET_KEY: string
        }
    }
}