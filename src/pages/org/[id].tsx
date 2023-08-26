import MainLayout from "~/components/mainLayout";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { InferGetServerSidePropsType } from "next/types";

const OrgDetails = ({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

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
      <div className="text-2xl font-semibold">
        <h1>Org Details:</h1>
      </div>
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
