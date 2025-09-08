import { Context } from "hono";
import { User } from "../models/user.model";
import { comparePasswords, hashPassword, signJwt } from "../lib/utils";
import { THIRTY_DAYS_SECS } from "../lib/constants";

export default class AuthController {

    async register(c: Context) {
        const { username, email, password } = await c.req.json();

        const passwordHash = await hashPassword(password);
        const user = await User.create({ username, email, password: passwordHash });
        const access_token = signJwt({ sub: user._id, exp: THIRTY_DAYS_SECS });

        return c.json({ username, access_token });
    }

    async login(c: Context) {
        const { email, password } = await c.req.json();

        const user = await User.findOne({ email });
        if (!user) return c.json({ error: "Invalid username or password" }, { status: 404 });

        const passwordsMatch = await comparePasswords(password, user.password!);
        if (!passwordsMatch) return c.json({ error: "Invalid username or password" }, { status: 404 });

        const access_token = signJwt({ sub: user._id, exp: THIRTY_DAYS_SECS });

        return c.json({ access_token });
    }

}