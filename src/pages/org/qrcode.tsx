import MainLayout, { OrgContext } from "~/components/mainLayout";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import QRCode from "qrcode.react";
import { useUser } from "@clerk/nextjs";
import type { ICustomMetadata } from "~/types/customMetadata";
import { hash } from "argon2";
import { api } from "~/utils/api";

const PostDetails = () => {
  const router = useRouter();

  const { user, isLoaded } = useUser();
  const org = useContext(OrgContext);

  useEffect(() => {
    if (isLoaded && !!user) {
      const { orgId } = user.publicMetadata as ICustomMetadata;
      if (orgId !== org?.id) {
        router.push("/403");
      }
    }
    if (!!!org) {
      router.push("/404");
    }
  }, [isLoaded]);

  const { data } = api.org.qrStringGenerator.useQuery(
    {
      orgId: org?.id!,
      createdAt: org?.createdAt!,
    },
    {
      enabled: Boolean(org),
    }
  );
  const hash2 = "test";
  // await hash(org?.createdAt.toDateString()!);

  return (
    <div>
      <div className="text-2xl font-semibold">
        <h1>Listings Details:</h1>
      </div>
      <div>
        <h1>User QR Code Generator</h1>
        {org && <QRCode value={`${org.id}+${hash2}`} />}
      </div>
    </div>
  );
};

export default PostDetails;

PostDetails.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
