import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors"
import { swagger } from "@elysiajs/swagger"
import config from "./config";

const app = new Elysia()

app.use(cors())
app.use(swagger())
app.listen(config.port)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
