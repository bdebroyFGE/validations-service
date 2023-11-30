import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator"
import { compareFacesSchema, getTextFromImageSchema } from "../utils/requests";
import { compareFaces, getTextFromImage } from "../controllers/ia";

const ia = new Hono();

ia.post("/compareFaces", zValidator('json', compareFacesSchema), async (c) => {
    const data = c.req.valid('json');
    let response: Awaited<ReturnType<typeof compareFaces>>
    if (process.env.NODE_ENV === "PROD") {
        response = await compareFaces(data.source, data.target, "prodbucket");
    } else {
        response = await compareFaces(data.source, data.target);
    }
    if (!response.success) {
        c.status(500)
    }
    return c.json(response);
});
ia.post("/getTextFromImage", zValidator('json', getTextFromImageSchema), async (c) => {
    const data = c.req.valid('json');
    let response: Awaited<ReturnType<typeof getTextFromImage>>
    if (process.env.NODE_ENV === "PROD") {
        response = await getTextFromImage(data.image, "prodbucket");
    } else {
        response = await getTextFromImage(data.image);
    }
    if (!response.success) {
        c.status(500)
    }
    return c.json(response);
});

export default ia;