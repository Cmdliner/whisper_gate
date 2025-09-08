import { verify, sign } from 'hono/jwt';
import { JWT_SECRET } from './constants';
import { compare, hash } from 'bcryptjs';

export const signJwt = async (payload: Record<string, any>, secret: string = JWT_SECRET) => {
    return sign(payload, secret);
}

export const verifyJwt = async (token: string, secret: string = JWT_SECRET) => {
    return verify(token, secret);
}
export const hashPassword = async (input: string) => await hash(input, 10);
export const comparePasswords = async (raw: string, hash: string) => await compare(raw, hash);

export const generateShortID = () => ""; 