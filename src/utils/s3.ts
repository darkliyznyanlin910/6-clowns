import { Credentials, S3 } from "aws-sdk";
import { env } from "~/env.mjs";

export const s3 = new S3({
  region: "ap-southeast-1",
  credentials: new Credentials({
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  }),
  signatureVersion: "v4",
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb",
    },
  },
};