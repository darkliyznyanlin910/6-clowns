import MainLayout, { OrgContext } from "~/components/mainLayout";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useUser } from "@clerk/nextjs";
import type { ICustomMetadata } from "~/types/customMetadata";
import { api } from "~/utils/api";

const PostDetails = () => {
  const router = useRouter();

  const { user, isLoaded } = useUser();
  const org = useContext(OrgContext);

  useEffect(() => {
    if (isLoaded && !!user && org) {
      const { orgId } = user.publicMetadata as ICustomMetadata;
      if (orgId !== org?.id) {
        router.push("/403");
      }
    }
  }, [isLoaded]);

  const { data, isLoading } = api.org.qrStringGenerator.useQuery(
    {
      orgName: org?.name!,
      orgId: org?.id!,
    },
    {
      enabled: Boolean(isLoaded && !!user && org),
    }
  );

  console.log(data?.split("~!@#$%"));

  return (
    <div className="flex justify-center">
      <div>
        <div className="text-2xl font-semibold">
          <h1>QR for {org?.name}</h1>
        </div>
        {!isLoading && (
          <QRCodeCanvas value={data ?? ""} className="w-3/4" size={360} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;

PostDetails.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
