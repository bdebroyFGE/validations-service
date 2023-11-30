import { z } from "zod";

export const renapRequestSchema = z.object({
    dpi: z.string().length(13),
})

export type renapRequest = z.infer<typeof renapRequestSchema>;

export const compareFacesSchema = z.object({
    source: z.string(),
    target: z.string(),
})

export type compareFacesRequest = z.infer<typeof compareFacesSchema>;

export const getTextFromImageSchema = z.object({
    image: z.string(),
})

export type getTextFromImageRequest = z.infer<typeof getTextFromImageSchema>;