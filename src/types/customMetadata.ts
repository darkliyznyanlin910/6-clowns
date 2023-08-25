import * as z from "zod";

export const customMetadataSchema = z.object({
  orgId: z.string().optional()
});

export type ICustomMetadata = z.infer<typeof customMetadataSchema>;