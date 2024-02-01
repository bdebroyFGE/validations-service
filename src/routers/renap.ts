import Elysia, { t } from "elysia";
import { getRenap } from "../controllers/renap";


const app = new Elysia({ prefix: "/renap" });

app.post("/get", async ({ body: { dpi }, set }) => {
    const response = await getRenap(dpi);
}, {
    body: t.Object({
        dpi: t.String()
    })
})

export default app;
