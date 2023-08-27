import MainLayout from "~/components/mainLayout";
import { api } from "~/utils/api";
import type { InferGetServerSidePropsType } from "next/types";
import PostPreview from "~/components/postPreview";
import type { IAddress } from "~/types/address";

const OrgDetails = ({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: org } = api.org.getDetails.useQuery(
    {
      orgId: id,
    },
    {
      enabled: Boolean(id),
    }
  );

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
      orgId: id,
    },
    {
      getNextPageParam: (lastPage) =>
        lastPage.status == "success" ? lastPage.data.nextCursor : undefined,
    }
  );

  return (
    <div>
      <div className="font-semibold">
        <h1 className="text-center text-3xl">Organization Details</h1>
      </div>
      <div className="pt-5 font-semibold">
        <p>Organization Name: {org?.status == "success" && org.data.name}</p>
        <p>Rating: {org?.status == "success" && org.data.rating} / 5.0</p>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {!!posts ? (
            <>
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
};

export default OrgDetails;

OrgDetails.getLayout = function getLayout(page: React.ReactElement) {
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
