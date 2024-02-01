import Elysia from "elysia";

const app = new Elysia();

app.get("/", () => "Hello World from Validations Service!");

export default app;