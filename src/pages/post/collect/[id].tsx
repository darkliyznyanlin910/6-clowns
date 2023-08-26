import MainLayout from "~/components/mainLayout";
import PostPreview from "~/components/postPreview";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { InferGetServerSidePropsType } from "next/types";
import React, { useState } from "react";
import QRCode from "qrcode.react";

const PostDetails = ({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const userData = JSON.stringify({});

  const { data: org } = api.user.getOrg.useQuery();

  const { data: post, isLoading } = api.post.getOne.useQuery(
    {
      postId: id,
    },
    {
      enabled: Boolean(id),
    }
  );

  return (
    <div>
      <div className=" flex justify-center">
        <div className="text-2xl font-semibold">
          <h1>QR code</h1>
        </div>
        <div className="ml-5">
          <QRCode value="12345" />
        </div>
      </div>

      <div className=" flex justify-center">
        <div className="text-2xl font-semibold">
          <h1>QR Scanner</h1>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;

PostDetails.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export async function getServerSideProps(ctx: { query: { id: string } }) {
  const { id } = ctx.query;
  return {
    props: {
      id,
    },
  };
}
