import MainLayout from "~/components/mainLayout";
import ListingDetails from "~/components/listingdetials";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { InferGetServerSidePropsType } from "next/types";
import axios from "axios";

const CreatePost = () => {
  const router = useRouter();

  let mockFile: File;
  const { mutateAsync: createPost } = api.post.create.useMutation();
  const { mutateAsync: signUrl } = api.post.signUrl.useMutation({
    onSettled(res) {
      if (res?.status == "success") {
        Promise.all(
          res.data.signedUrls.map(async (signedUrl) => {
            axios.put(
              signedUrl,
              mockFile.name, //should be file
              {
                headers: {
                  ContentType: mockFile.type,
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

  const HandleSubmit = () => {
    signUrl({
      imageTypes: [mockFile.type],
      postAs: "org",
    });
  };

  return (
    <div>
      <div className="text-2xl font-semibold">
        <h1>Create New Post</h1>
      </div>
    </div>
  );
};

export default CreatePost;

CreatePost.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
