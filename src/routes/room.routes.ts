import { Hono } from "hono";
import { roomController } from "../controllers";

export const room = new Hono()

room.post('/create', roomController.create);
room.post('/:roomID/:userID/join', roomController.join);