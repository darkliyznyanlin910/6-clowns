import MainLayout from "~/components/mainLayout";
import { api } from "~/utils/api";
import { useState } from "react";
import type { IAlert } from "~/types/alert";
import CustomAlert from "~/components/alert";
import Link from "next/link";

const JoinOrg = () => {
  const [alert, setAlert] = useState<IAlert>({
    set: false,
    status: "neutral",
    message: "",
  });

  const { mutateAsync: joinOrg } = api.user.joinOrg.useMutation({
    onSettled(data) {
      setSubmitting(false);
      if (data?.status == "success") {
        setAlert({
          set: true,
          status: "success",
          message: `You have successfully joined ${data.data.name}.`,
        });
        setInviteCode("");
      } else if (data?.status == "unauthorized") {
        setAlert({ set: true, status: "error", message: `Invalid code.` });
      } else {
        setAlert({
          set: true,
          status: "error",
          message: `Internal Server Error.`,
        });
      }
    },
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [inviteCode, setInviteCode] = useState<string>("");

  const HandleSubmit = async () => {
    setSubmitting(true);
    await joinOrg({
      inviteCode,
    });
  };

  return (
    <div>
      <div className="mb-2">
        <CustomAlert alert={alert} />
      </div>
      <div className="card-compact card flex flex-col rounded-3xl bg-base-100 p-4 shadow-xl md:card-side md:p-6 lg:p-8">
        <div className="card-body md:w-2/3">
          <h1 className="text-center text-3xl font-semibold">
            Join an Organization
          </h1>
          <div className="mt-1 lg:px-40">
            {/* <h1 className="text-xl font-semibold">
              Fill in your referral code here:
            </h1> */}
            <input
              type="text"
              placeholder="Fill in your Referral code here"
              className="input input-bordered mt-2 w-full rounded-3xl"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
            />
            <div className="mt-4 flex justify-between">
              <Link href={"/"} className="btn btn-neutral rounded-2xl">
                Back
              </Link>
              <button
                type="button"
                className=" btn btn-secondary rounded-2xl"
                onClick={HandleSubmit}
                disabled={submitting}
              >
                Submit
              </button>
            </div>
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
