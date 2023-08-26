import MainLayout from "~/components/mainLayout";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { InferGetServerSidePropsType } from "next/types";
import axios from "axios";
import { useState } from "react";
import MultiFileSelector from "~/components/multiFileSelector";
import ImagePreview from "~/components/imagePreview";

const CreatePost = () => {
  const router = useRouter();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const { mutateAsync: createPost } = api.post.create.useMutation({
    onSettled() {
      setSubmitting(false);
    },
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

  const HandleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      //convert `FileList` to `File[]`
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
      <div className="text-2xl font-semibold">
        <h1>Create New Post</h1>
        <div className="w-full">
          <MultiFileSelector
            accept="image/png, image/jpeg"
            onChange={HandleFileSelected}
          />
          <ImagePreview images={images} remove={HandleRemove} />
        </div>

        <div className="flex-co flex">
          <input
            type="text"
            placeholder="Title"
            className=""
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={HandleSubmit}
          disabled={submitting}
        ></button>
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
