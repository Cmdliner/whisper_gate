import { model, Schema } from "mongoose";

export const RoomSchema = new Schema({
    host: { type: Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    name: { type: String, },
    short_id: { type: String, required: true, unique: true }

}, { timestamps: true });

export const Room = model("Room", RoomSchema);