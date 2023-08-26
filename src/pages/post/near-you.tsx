import { useEffect, useState } from "react";
import Link from "next/link";
import MainLayout from "~/components/mainLayout";
import PostPreview from "~/components/postPreview";
import { api } from "~/utils/api";
import { IAddress } from "~/types/address";

export default function Home() {
  const [lat, setLat] = useState<number>(1.287953);
  const [lon, setLon] = useState<number>(103.851784);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((geo) => {
      setLat(geo.coords.latitude);
      setLon(geo.coords.longitude);
    });
  }, []);

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
      lat,
      lon,
    },
    {
      getNextPageParam: (lastPage) =>
        lastPage.status == "success" ? lastPage.data.nextCursor : undefined,
      enabled: !!lat && !!lon,
    }
  );
  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {!!posts ? (
            <>
              <div className="my-4 grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <p className="text-2xl font-semibold">Posts Near You</p>
                </div>
              </div>
              {posts.pages.flatMap((page) => {
                if (page.status == "success") {
                  return page.data.getPosts.map((post, index) => (
                    <PostPreview
                      key={index}
                      post={post}
                      address={post.address as IAddress}
                      userCoordinate={{ lat, lon }}
                    />
                  ));
                }
              })}
              <div className="self-center">
                {hasNextPage && (
                  <button
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                  >
                    More
                  </button>
                )}
              </div>
            </>
          ) : (
            <p>Error</p>
          )}
        </>
      )}
    </div>
  );
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
