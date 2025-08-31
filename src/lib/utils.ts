import { sign } from 'hono/jwt';
import { JWT_SECRET } from './constants';
import { hash } from 'bun';

export const signJWT = async (payload: Record<string, any>, secret: string = JWT_SECRET) => {
    return sign(payload, secret);
}

export const hashPassword = async (input: string) => hash(input, 10);
export const comparePasswords = async (raw: string, hash: string) => raw  === hash;

export const generateShortID = () => ""; 