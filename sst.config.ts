import { SSTConfig } from "sst";
import { Bucket, NextjsSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "6-clowns",
      region: "ap-southeast-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const bucket = new Bucket(stack, "public", {
        name: "jiak-jiak"
      });
      const site = new NextjsSite(stack, "site", {
        environment: {
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
          CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
          DATABASE_URL: process.env.DATABASE_URL!,
        },
        bind: [bucket]
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
