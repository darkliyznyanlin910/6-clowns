import MainLayout from "~/components/mainLayout";
import { api } from "~/utils/api";
import type { InferGetServerSidePropsType } from "next/types";
import React, { useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import Webcam from "react-webcam";
import CustomAlert from "~/components/alert";
import type { IAlert } from "~/types/alert";
import Link from "next/link";

const PostDetails = ({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { mutateAsync: collect } = api.user.collect.useMutation({
    onSettled(res) {
      setSubmitting(false);
      if (res?.status == "success") {
        setAlert({
          set: true,
          status: "success",
          message: "Collection successful",
        });
        setQuantity(0);
      } else {
        setAlert({
          set: true,
          status: "error",
          message: "Collection failed",
        });
      }
    },
  });

  const webcamRef = useRef<Webcam>(null);
  const [scannedResult, setScannedResult] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [alert, setAlert] = useState<IAlert>({
    set: false,
    status: "neutral",
    message: "",
  });

  const handleScan = async () => {
    const webcam = webcamRef.current;
    const codeReader = new BrowserMultiFormatReader();

    try {
      const result = await codeReader.decodeFromInputVideoDevice(
        undefined,
        webcam?.video!
      );

      if (result) {
        setScannedResult(result.getText());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const HandleSubmit = async () => {
    setSubmitting(true);
    await collect({
      quantity,
      orgId: scannedResult.split("+")[0]!,
      postId: id,
      hash: scannedResult.split("+")[1]!,
    });
  };
  return (
    <div className="flex justify-center">
      <div>
        <div className="mb-2">
          <CustomAlert alert={alert} />
        </div>
        <div className=" justify-center text-2xl font-semibold">
          <div className="mt-4">
            {scannedResult.length == 0 ? (
              <div>
                <h1>Scan QR code</h1>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  mirrored={false}
                  onUserMedia={() => handleScan()}
                />
              </div>
            ) : (
              <div className="w-full rounded-3xl bg-white p-4 md:p-6 lg:p-8">
                <p className="font-semibold">Quantity collected:</p>
                <div className="inline-flex w-full justify-between">
                  <button
                    className="rounded-3xl bg-secondary px-2 py-1 text-white"
                    type="button"
                    onClick={() => setQuantity((quantity) => quantity - 1)}
                    disabled={quantity == 0}
                  >
                    &lt;
                  </button>
                  <p className="text-center">{quantity}</p>
                  <button
                    className="rounded-3xl bg-secondary px-2 py-1 text-white"
                    type="button"
                    onClick={() => setQuantity((quantity) => quantity + 1)}
                  >
                    &gt;
                  </button>
                </div>
                <p>{scannedResult}</p>
                <div className="mt-4 flex justify-between">
                  <Link href={"/"} className="btn btn-neutral rounded-2xl">
                    Back
                  </Link>
                  <button
                    type="button"
                    className="btn btn-secondary rounded-2xl"
                    onClick={HandleSubmit}
                    disabled={submitting}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;

PostDetails.getLayout = function getLayout(page: React.ReactElement) {
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
