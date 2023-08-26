import * as z from "zod";

export const addressSchema = z.object({
  line1: z.string(),
  line2: z.string().optional(),
  unitNo: z.string(),
  postal_code: z.string().regex(/^[0-9]+$/),
});

export type IAddress = z.infer<typeof addressSchema>;