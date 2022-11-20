import { createClient } from "redis";

export default async function loadRedis() {
  const client = createClient();

  console.log("creating new client");

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  return client;
}
