import { Redis } from "@upstash/redis";

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export const redisHelper = {
  /**
   * Fetch data from Redis by key
   * @param key - The key to retrieve
   * @returns The cached data or null if not found
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      if (typeof data === "string") {
        return JSON.parse(data); // Safely parse JSON data
      }
      return null; // Return null if data is not a string (unexpected format)
    } catch (error) {
      console.error("Redis GET error:", error);
      return null;
    }
  },

  /**
   * Set data in Redis with an optional TTL
   * @param key - The key to set
   * @param value - The value to store
   * @param ttl - Time-to-Live in seconds (optional)
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const stringValue = JSON.stringify(value); // Always serialize data
      if (ttl) {
        await redis.set(key, stringValue, { ex: ttl });
      } else {
        await redis.set(key, stringValue);
      }
    } catch (error) {
      console.error("Redis SET error:", error);
    }
  },

  /**
   * Delete a key from Redis
   * @param key - The key to delete
   */
  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error("Redis DEL error:", error);
    }
  },
};
