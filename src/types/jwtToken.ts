export type JWTToken = {
    sub: string;
    username: string;
    email?: string;
    exp: number;
    is_staff: boolean;
    role: string;
};
