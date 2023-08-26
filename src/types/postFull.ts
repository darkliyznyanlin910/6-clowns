import { Org, Image, Post } from "@prisma/client";

export type PostFull = {
  org: Org | null,
  images: Image[],
} & Post