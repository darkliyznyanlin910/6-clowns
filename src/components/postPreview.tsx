import Link from "next/link";
import Image from "next/image";
import TimeAgo from "react-timeago";
import { PostFull } from "~/types/postFull";
import { useState } from "react";
import { calculateDistance } from "~/utils/calculateDistance";

interface Props {
  post: PostFull;
  userCoordinate: {
    lat: number;
    lon: number;
  } | null;
}

const PostPreview = ({ post, userCoordinate }: Props) => {
  const [details, setDetails] = useState<boolean>(false);
  return (
    <div className="card-compact card mx-auto bg-base-100 shadow-xl md:card-side">
      <figure className="w-full md:w-1/3">
        <Image
          src={post.images[0]?.url!}
          alt={"test"}
          width={400}
          height={400}
          priority
        />
      </figure>
      <div className="card-body md:w-2/3">
        <h2 className="card-title">
          <Link href={`/org/${"id"}`}>
            {!!post.org ? post.org.name : post.ownerName}
            {!!post.org && (
              <span className="ml-2 text-sm text-secondary">
                {post.org.rating} / 5.0
              </span>
            )}
          </Link>
        </h2>
        {!!userCoordinate && (
          <p className="text-secondary">
            {calculateDistance(
              post.lat,
              post.lon,
              userCoordinate.lat,
              userCoordinate.lon
            )}{" "}
            KM away
          </p>
        )}
        <p>
          Expiring in{" "}
          <TimeAgo
            date={"2023-08-27T17:30"}
            formatter={(value, unit) => {
              return `${value} ${unit}${value > 1 ? "s" : ""}`;
            }}
          />
        </p>
        <div>{post.description}</div>
        {details && (
          <p>
            Location: {"Address"}
            <br />
            Quantity: {post.quantity} <br />
            Best before: {"date"}
          </p>
        )}
        <div className="card-actions justify-between">
          <div>
            <button
              className="btn btn-neutral mr-4"
              type="button"
              onClick={() => setDetails((state) => !state)}
            >
              {details ? "Hide" : "Details"}
            </button>
            <Link
              href={`/post/collect/${post.id}`}
              className="btn btn-secondary mt-2"
            >
              Jiak!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;
