import { RedisClient } from "bun";
import mongoose from "mongoose";

export const redisPub =  new RedisClient(process.env.REDIS_PUB_URI || 'redis:localhost:6379')
export const redisSub = new RedisClient(process.env.REDIS_SUB_URI || 'redis:localhost:6379')

export const dbConnect = async () => await  mongoose.connect(process.env.MONGO_URI!);