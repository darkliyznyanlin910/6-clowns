import MainLayout from "~/components/mainLayout";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useState } from "react";

const JoinOrg = () => {
  const router = useRouter();

  const { mutateAsync: joinOrg } = api.user.joinOrg.useMutation({
    onSettled() {
      setSubmitting(false);
    },
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [inviteCode, setInviteCode] = useState<string>("");

  const HandleSubmit = () => {
    joinOrg({
      inviteCode: "123456",
    });
  };
  return (
    <div>
      <div className="card-compact card rounded-3xl bg-base-100 p-4 shadow-xl md:card-side md:p-6 lg:p-8">
        <div className="card-body md:w-2/3">
          <h1 className="text-center text-3xl font-semibold">Join an Org</h1>
          <div className="">
            <h1 className="text-xl font-semibold">
              Fill in your referral code here:
            </h1>
            <input
              type="text"
              placeholder="Referral code"
              className="input input-bordered mt-2 w-full rounded-3xl"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-secondary mt-2 rounded-2xl"
              onClick={HandleSubmit}
              disabled={submitting}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinOrg;

JoinOrg.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
