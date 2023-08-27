import MainLayout, { OrgContext } from "~/components/mainLayout";
import { api } from "~/utils/api";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import MultiFileSelector from "~/components/multiFileSelector";
import ImagePreview from "~/components/imagePreview";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import type { IAlert } from "~/types/alert";
import CustomAlert from "~/components/alert";
import type { ICustomMetadata } from "~/types/customMetadata";

const CreatePost = () => {
  const { user, isLoaded } = useUser();
  const org = useContext(OrgContext);
  const [orgId, setOrgId] = useState<string>();

  useEffect(() => {
    if (isLoaded && !!user) {
      const { orgId: data } = user.publicMetadata as ICustomMetadata;
      setOrgId(data);
    }
  }, [isLoaded]);

  const [alert, setAlert] = useState<IAlert>({
    set: false,
    status: "neutral",
    message: "",
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const { mutateAsync: createPost } = api.post.create.useMutation({
    onSettled() {
      setSubmitting(false);
      setAlert({
        set: true,
        status: "success",
        message: `Post successfully created.`,
      });
    },
    onError() {
      setAlert({
        set: true,
        status: "error",
        message: `Post creation failed.`,
      });
    },
  });
  const { mutateAsync: signUrl } = api.post.signUrl.useMutation({
    onSettled(res) {
      if (res?.status == "success") {
        Promise.all(
          res.data.signedUrls.map(async (signedUrl, index) => {
            axios.put(
              signedUrl,
              images[index]?.file, //should be file
              {
                headers: {
                  ContentType: images[index]?.file.type!,
                  "Access-Control-Allow-Origin": "*",
                },
              }
            );
          })
        )
          .then(() => {
            createPost({
              postAs,
              description,
              images: res.data.sources,
              quantity,
              address: {
                line1,
                line2,
                unitNo,
                postal_code,
              },
              bestBefore,
            });
          })
          .then(() => {
            // Reset the form data after createPost is successful
            setImages([]);
            setDescription("");
            setLine1("");
            setLine2("");
            setUnitNo("");
            setPostal_code("");
            setBestBefore(new Date());
            setQuantity(0);
            setPostAs("user");
          })
          .catch(() => {
            setAlert({
              set: true,
              status: "error",
              message: `Image upload failed.`,
            });
          });
      } else {
        setAlert({
          set: true,
          status: "error",
          message: ``,
        });
      }
    },
  });

  const [images, setImages] = useState<{ file: File; id: string }[]>([]);
  const [description, setDescription] = useState<string>("");
  const [line1, setLine1] = useState<string>("");
  const [line2, setLine2] = useState<string>("");
  const [unitNo, setUnitNo] = useState<string>("");
  const [postal_code, setPostal_code] = useState<string>("");
  const [bestBefore, setBestBefore] = useState<Date>(new Date());
  const [quantity, setQuantity] = useState<number>(0);
  const [postAs, setPostAs] = useState<"user" | "org">("user");

  const HandleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files.map((file) => ({ file, id: crypto.randomUUID() })));
    }
  };

  const HandleSubmit = () => {
    setSubmitting(true);
    setAlert({
      set: true,
      status: "neutral",
      message: `Uploading Images...`,
    });
    signUrl({
      imageTypes: images.map((image) => image.file.type),
      postAs,
    });
  };

  const HandleRemove = (idToRemove: string) => {
    const updatedData = images.filter((item) => item.id !== idToRemove);
    setImages(updatedData);
  };

  return (
    <div>
      <div className="mb-2">
        <CustomAlert alert={alert} />
      </div>
      <div className="rounded-3xl bg-white p-4 md:p-6 lg:p-8">
        <div className="text-3xl font-semibold">
          <h1 className="text-center">Create New Post</h1>
          <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3 ">
            <div className="col-span-1 md:p-3 lg:p-4">
              <MultiFileSelector
                accept="image/png, image/jpeg"
                count={images.length}
                onChange={HandleFileSelected}
              />
              <ImagePreview images={images} remove={HandleRemove} />
            </div>
            <div className="col-span-1 md:col-span-2">
              <div>
                {!!org && orgId == org.id && (
                  <select
                    className="select select-bordered select-sm mt-4 w-full rounded-3xl"
                    onChange={(e) =>
                      setPostAs(e.target.value == "user" ? "user" : "org")
                    }
                  >
                    <option value={"user"}>Post as {user?.fullName}</option>
                    <option value={"org"}>Post as {org?.name}</option>
                  </select>
                )}
                <input
                  type="text"
                  placeholder="Address line 1"
                  className="input input-bordered input-sm mt-2 w-full rounded-3xl"
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Address line 2"
                  className="input input-bordered input-sm mt-2 w-full rounded-3xl"
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-1">
                    <input
                      type="text"
                      placeholder="Unit No"
                      className="input input-bordered input-sm mt-2 w-full rounded-3xl"
                      value={unitNo}
                      onChange={(e) => setUnitNo(e.target.value)}
                    />
                  </div>
                  <div className="col-span-1">
                    <input
                      type="text"
                      placeholder="Postal code"
                      className="input input-bordered input-sm mt-2 w-full rounded-3xl"
                      value={postal_code}
                      onChange={(e) => setPostal_code(e.target.value)}
                    />
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Description"
                  className=" input input-bordered mt-2 h-16 w-full rounded-3xl md:h-32 lg:h-48"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className=" grid grid-cols-2 gap-2">
                  <div className="col-span-1">
                    <DatePicker
                      placeholderText="Best Before"
                      className="input input-bordered input-sm w-full rounded-3xl"
                      selected={bestBefore}
                      onChange={(date) => {
                        setBestBefore(date ?? new Date());
                      }}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={30}
                      dateFormat="d/MM/yyyy HH:mm"
                      timeCaption="Time"
                    />
                  </div>
                  <div className="col-span-1">
                    <input
                      type="number"
                      placeholder="Quantity"
                      className="input input-bordered input-sm w-full rounded-3xl"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-2 flex justify-between">
                <Link href={"/"} className="btn btn-neutral mt-2 rounded-2xl">
                  Back
                </Link>
                <button
                  type="button"
                  className="btn btn-secondary mt-2 rounded-2xl"
                  onClick={HandleSubmit}
                  disabled={submitting}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

CreatePost.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
