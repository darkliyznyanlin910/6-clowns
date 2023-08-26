import MainLayout from "~/components/mainLayout";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import axios from "axios";
import { useState } from "react";
import MultiFileSelector from "~/components/multiFileSelector";
import ImagePreview from "~/components/imagePreview";
import DatePicker from "react-datepicker";
import Link from "next/link";

const CreatePost = () => {
  const router = useRouter();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const { mutateAsync: createPost } = api.post.create.useMutation({
    onSettled() {
      setSubmitting(false);
    },
  });

  const { data } = api.user.getOrg.useQuery(undefined, {
    enabled: false,
  });
  const { mutateAsync: signUrl } = api.post.signUrl.useMutation({
    onSettled(res) {
      if (res?.status == "success") {
        Promise.all(
          res.data.signedUrls.map(async (signedUrl, index) => {
            axios.put(
              signedUrl,
              images[index], //should be file
              {
                headers: {
                  ContentType: images[index]?.file.type!,
                  "Access-Control-Allow-Origin": "*",
                },
              }
            );
          })
        );
        createPost({
          postAs: "org",
          description: "",
          images: res.data.sources,
          quantity: 0,
          address: {
            line1: "string",
            unitNo: "string",
            postal_code: "string",
          },
          bestBefore: new Date(),
        });
      }
    },
  });

  const [images, setImages] = useState<{ file: File; id: string }[]>([]);
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [bestBefore, setBestBefore] = useState<Date>();
  const [quantity, setQuantity] = useState<number>();

  const HandleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files.map((file) => ({ file, id: crypto.randomUUID() })));
    }
  };

  const HandleSubmit = () => {
    setSubmitting(true);
    signUrl({
      imageTypes: images.map((image) => image.file.type),
      postAs: "org",
    });
  };

  const HandleRemove = (idToRemove: string) => {
    const updatedData = images.filter((item) => item.id !== idToRemove);
    setImages(updatedData);
  };

  return (
    <div>
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
                <select className="select select-bordered mt-2  w-full rounded-3xl">
                  <option disabled selected>
                    Users' Name or Organisation Name
                  </option>
                  <option>User</option>
                  <option>Org</option>
                </select>
                <input
                  type="text"
                  placeholder="Address line 1"
                  className="input input-bordered input-sm mt-2 w-full rounded-3xl"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Address line 2"
                  className="input input-bordered input-sm mt-2 w-full rounded-3xl"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="col-span-1">
                    <input
                      type="text"
                      placeholder="Unit No"
                      className="input input-bordered input-sm mt-2 w-full rounded-3xl"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div className="col-span-1">
                    <input
                      type="text"
                      placeholder="Postal code"
                      className="input input-bordered input-sm mt-2 w-full rounded-3xl"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
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
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="col-span-1">
                    <DatePicker
                      placeholderText="Best Before"
                      className="input input-bordered input-sm mt-2 block w-full rounded-3xl"
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
                      className="input input-bordered input-sm mt-2 w-full rounded-3xl"
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
function setData(updatedData: { file: File; id: string }[]) {
  throw new Error("Function not implemented.");
}
