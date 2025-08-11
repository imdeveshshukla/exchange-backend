// src/redisClient.ts
import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Standard client for commands (queue, set/get, etc.)
export const redisClient = createClient({ url: REDIS_URL });

// Separate client for pub/sub (cannot reuse same connection for both at the same time)
export const pubSubClient = createClient({ url: REDIS_URL });

redisClient.on('error', (err) => console.error('Redis Client Error', err));
pubSubClient.on('error', (err) => console.error('Redis PubSub Client Error', err));

export async function initRedis() {
  if (!redisClient.isOpen) await redisClient.connect();
  if (!pubSubClient.isOpen) await pubSubClient.connect();
}
