import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator"
import { renapRequestSchema } from "../utils/requests";
import { getRenap } from "../controllers/renap";

const renap = new Hono();

renap.post("/getInfo", zValidator('json', renapRequestSchema), async (c) => {
    const data = c.req.valid('json');
    const response = await getRenap(data.dpi);
    if (!response.success) {
        c.status(500)
    }
    return c.json(response);
});

export default renap;