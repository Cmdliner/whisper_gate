import { Hono } from "hono";
import { auth } from "./auth.route";
import { room } from "./room.routes";
import { jwt } from "hono/jwt";

type Bindings  = {
    JWT_SECRET:  string;
}
export const api = new Hono<{Bindings: Bindings}>();

api.use('/auth/*', (c, next) => {
    const jwtMiddleware = jwt({secret: c.env.JWT_SECRET});
    return jwtMiddleware(c, next)
})
api.route('/auth', auth)
api.route('/rooms', room)