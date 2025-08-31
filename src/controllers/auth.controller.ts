import { Context } from "hono";
import { User } from "../models/user.model";
import { comparePasswords, hashPassword, signJWT } from "../lib/utils";
import { THIRTY_DAYS_MS } from "../lib/constants";

export default class AuthController {

    async register(c: Context) {
        const { username, email, password } = await c.req.json();

        const passwordHash = await hashPassword(password);
        const user = await User.create({ username, email, password: passwordHash});
        const access_token = signJWT({ sub: user._id, exp: Date.now() + THIRTY_DAYS_MS });

        return c.json({ username, access_token });
    }

    async login(c: Context) {
        const { email, password } = await c.req.json();

        const user = await User.findOne({ email });
        if (!user) return c.json({ error: "Invalid username or password" }, { status: 404 });

        const passwordsMatch = comparePasswords(password, user.password!);
        if (!passwordsMatch) return c.json({ error: "Invalid username or password" }, { status: 404 });

        const access_token = signJWT({ sub: user._id });

        return c.json({ access_token });
    }

}