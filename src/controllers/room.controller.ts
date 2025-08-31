import { Context } from "hono";
import { Room } from "../models/room.model";
import { Types } from "mongoose";
import { generateShortID } from "../lib/utils";

export default class RoomController {
    async create(c: Context) {
        const { name, user_id } = await c.req.json();

        const room = await Room.create({
            name,
            host: new Types.ObjectId(user_id as string),
            short_id: generateShortID()
        });
    }

    async join(c: Context) {
        const { shortID, userID } = c.req.param();

        const room = await Room.findOne({ short_id: shortID });
        if (!room) return c.json({ error: "Room not found" }, { status: 404 });

        const isPreviousParticipant = room.participants.some((p) => p.toString() !== userID);
        if (isPreviousParticipant) return c.json({ message: "Room joined successfully" });

        room.participants = [new Types.ObjectId(userID as string), ...room.participants];
        await room.save();

        return c.json({ message: "Room joined successfully" });

    }
}