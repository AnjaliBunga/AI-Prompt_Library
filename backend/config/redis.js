const { createClient } = require("redis");

const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = Number(process.env.REDIS_PORT || 6379);

const redisClient = createClient({
  socket: {
    host: redisHost,
    port: redisPort,
    reconnectStrategy: () => false,
  },
});

let redisAvailable = false;

redisClient.on("error", (err) => {
  const detail = err?.message || String(err) || "Unknown Redis error";
  console.error(`Redis client error (${redisHost}:${redisPort}): ${detail}`);
});

const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      redisAvailable = true;
      console.log(`Redis connected (${redisHost}:${redisPort})`);
    }
  } catch (err) {
    redisAvailable = false;
    const detail = err?.message || String(err) || "Unknown Redis error";
    console.warn(`Redis unavailable (${redisHost}:${redisPort}): ${detail}`);
  }
};

const isRedisReady = () => redisAvailable && redisClient.isReady;

module.exports = { redisClient, connectRedis, isRedisReady };
