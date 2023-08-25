import { z } from "zod";

const apiResponseSchema = <T>(dataType: z.ZodType<T>) => 
  z.object({
    status: z.literal("success"),
    data: dataType
  }).or(z.object({
    status: z.literal("error"),
  })).or(z.object({
    status: z.literal("unauthorized"),
  }))

export type IApiResponse<T> = z.infer<ReturnType<typeof apiResponseSchema<T>>>;
