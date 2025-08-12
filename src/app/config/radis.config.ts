import { createClient } from "redis";
import config from ".";

export const radisClient = createClient({
  username: config.RADIS_USERNAME,
  password: config.RADIS_PASSWORD,
  socket: {
    host: config.RADIS_HOST,
    port: Number(config.RADIS_PORT),
  },
});

radisClient.on("error", (err) => console.log("Redis Client Error", err));

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar
export const redisConnection = async () => {
  if (!radisClient.isOpen) {
    await radisClient.connect();
    console.log(`Radis Connected Successfully`);
  }
};
