import Link from "next/link";
import MainLayout from "~/components/mainLayout";
import PostPreview from "~/components/postPreview";
import type { IAddress } from "~/types/address";
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
      getNextPageParam: (lastPage) =>
        lastPage.status == "success" ? lastPage.data.nextCursor : undefined,
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
                  <p className="text-2xl font-semibold">New Posts</p>
                </div>
                <div className="col-span-1 justify-self-end">
                  <Link
                    href={"/post/near-you"}
                    className="rounded-xl bg-secondary px-2 py-2 font-semibold text-white"
                  >
                    Near you
                  </Link>
                </div>
              </div>
              {posts.pages.flatMap((page) => {
                if (page.status == "success") {
                  return page.data.getPosts.map((post) => (
                    <PostPreview
                      key={post.id}
                      post={post}
                      address={post.address as IAddress}
                      userCoordinate={null}
                    />
                  ));
                }
              })}
              <div className="flex justify-center">
                {hasNextPage && (
                  <button
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                    className="btn btn-secondary btn-wide"
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
