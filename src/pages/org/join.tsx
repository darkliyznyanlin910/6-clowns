import MainLayout from "~/components/mainLayout";
import ListingDetails from "~/components/listingdetials";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { InferGetServerSidePropsType } from "next/types";

const JoinOrg = () => {
  const router = useRouter();

  const { mutateAsync: joinOrg } = api.user.joinOrg.useMutation();

  const HandleSubmit = () => {
    joinOrg({
      inviteCode: "123456",
    });
  };
  return (
    <div>
      <div className="text-2xl font-semibold">
        <h1>Join an Org</h1>
      </div>
    </div>
  );
};

export default JoinOrg;

JoinOrg.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
