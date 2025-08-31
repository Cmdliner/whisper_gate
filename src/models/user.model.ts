import { model, Schema } from "mongoose";

export const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, sparse: true },
    password: { type: String }
});

export const User = model("User", UserSchema);