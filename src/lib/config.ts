import { Redis } from 'ioredis'
import mongoose from "mongoose";

export const redisPub =  new Redis(process.env.REDIS_PUB_URI || 'redis://localhost:6379')
export const redisSub = new Redis(process.env.REDIS_SUB_URI || 'redis://localhost:6379')

export const dbConnect = async () => await  mongoose.connect(process.env.MONGO_URI!);