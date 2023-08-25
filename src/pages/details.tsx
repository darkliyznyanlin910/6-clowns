import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import MainLayout from "~/components/mainLayout";
import ListingDetails from "~/components/listingdetials";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.post.get.useQuery();

  return (
    <div>
      <div className="text-2xl font-semibold">
        <h1>Listings Details:</h1>
      </div>
      <ListingDetails />
    </div>
  );
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
