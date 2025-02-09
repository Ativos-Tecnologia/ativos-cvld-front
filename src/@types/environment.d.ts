declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_BASE_URL: string;
            NEXT_PUBLIC_USER_TYPE: string;
            NEXT_PUBLIC_USER_TOKEN_EXPIRES_IN: string;
            NEXT_PUBLIC_USER_TOKEN: string;
            USER_REFRESH_TOKEN_KEY: string;
            NEXT_NODE_ENV: string;
            API_URL: string;
            ACCESS_TOKEN_KEY: string;
            REFRESH_TOKEN_KEY: string;
            ANTHROPIC_API_KEY: string;
        }
    }
}

export {};
