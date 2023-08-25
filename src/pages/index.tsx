import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import MainLayout from "~/components/mainLayout";
import Listings from "~/components/listings";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.post.get.useQuery();
  return (
    <div>
      <Listings />
    </div>
  );
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
