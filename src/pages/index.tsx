import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import MainLayout from "~/components/mainLayout";
import Listings from "~/components/listings";
import { api } from "~/utils/api";

export default function Home() {
  const {
    data: posts,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.post.getMultiple.useInfiniteQuery(
    {
      limit: 10,
      showHistory: false,
    },
    {
      getNextPageParam: (lastPage) => lastPage.data?.nextCursor,
    }
  );
  return (
    <div>
      <Listings />
    </div>
  );
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
