import { Hono } from "hono";
import { auth } from "./auth.route";
import { room } from "./room.routes";

export const api = new Hono();

api.route('/auth', auth)
api.route('/rooms', room)