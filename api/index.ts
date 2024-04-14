import express, { Express, Request, Response } from "express";
import { IdKeyObject } from "./types";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "redis";

const port = process.env.PORT || 3000;
const redisPort = process.env.REDIS_PORT || 6379;
const redisHost = process.env.REDIS_HOST || "redis";

const redis = createClient({
  socket: {
    host: redisHost,
    port: +redisPort,
  },
});
redis.on("error", (err) => console.log("Redis Client Error", err));
process.on("exit", (code) => {
  redis.disconnect();
});
process.on("SIGINT", () => {
  redis.disconnect();
});
const app: Express = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`, req.body);
  next();
});
app.get("/", (req: Request, res: Response) => {
  res.send("API");
});
app.get("/alumni", async (req: Request, res: Response) => {
  try {
    let promises = [];
    for await (const key of redis.scanIterator()) {
      promises.push(Promise.all([key, redis.json.get(key)]));
    }
    const result = await Promise.all(promises);
    const output: IdKeyObject[] =
      result.map(([key, item]) => {
        return { ...item, id: key };
      }) || [];
    res.json({ ok: true, data: output });
  } catch (err) {
    console.log("ERROR: ", err);
    res.status(500).json({ ok: false, error: "Unable to fulfill your request." });
  }
});
app.get("/alumni/:id", async (req: Request, res: Response) => {
  try {
    const key = req.params["id"];
    const result = await redis.json.get(key, "$");
    const output: IdKeyObject = { ...result, id: key };
    res.json({ ok: true, data: output });
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ ok: false, error: "Unable to fulfill your request." });
  }
});
app.put("/alumni", async (req: Request, res: Response) => {
  try {
    const { ["id"]: _, ...objectToStore } = req.body;
    const key = uuidv4();
    const result = await redis.json.set(key, "$", objectToStore);
    const output: IdKeyObject = { ...objectToStore, id: key };
    res.json({ ok: true, data: output });
  } catch (err) {
    console.log("ERROR: ", err);
    res.status(500).json({ ok: false, error: "Unable to fulfill your request." });
  }
});
app.post("/alumni", async (req: Request, res: Response) => {
  try {
    const { ["id"]: _, ...objectToStore } = req.body;
    const key = (<IdKeyObject>req.body).id;
    const result = await redis.json.set(key, "$", objectToStore);
    const output: IdKeyObject = { ...objectToStore, id: key };
    res.json({ ok: true, data: output });
  } catch (err) {
    console.log("ERROR: ", err);
    res.status(500).json({ ok: false, error: "Unable to fulfill your request." });
  }
});
app.delete("/alumni/:id", async (req: Request, res: Response) => {
  try {
    const key = req.params["id"];
    const result = await redis.del(key);
    res.json({ ok: true, data: key });
  } catch (err) {
    console.log("ERROR: ", err);
    res.status(500).json({ ok: false, error: "Unable to fulfill your request." });
  }
});

app.listen(port, async () => {
  console.log(`[server]: Server is running on port ${port}.`);
  await redis.connect();
  console.log(`[server]: Connected to redis.`);
});
