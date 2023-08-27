import Link from "next/link";
import Image from "next/image";
import TimeAgo from "react-timeago";
import type { PostFull } from "~/types/postFull";
import type { IAddress } from "~/types/address";
import { useState } from "react";
import { calculateDistance } from "~/utils/calculateDistance";

interface Props {
  post: PostFull;
  userCoordinate: {
    lat: number;
    lon: number;
  } | null;
  address: IAddress;
}

const PostPreview = ({ post, userCoordinate, address }: Props) => {
  const [details, setDetails] = useState<boolean>(false);
  const [hovered, setHovered] = useState(false);
  const [index, setIndex] = useState<number>(0);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };
  return (
    <div className="card-compact card mx-auto my-3 bg-base-100 shadow-xl md:card-side">
      <figure
        className="relative w-full md:w-1/3"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div>
          {post.images.map(({ url }, localIndex) => (
            <Image
              key={localIndex}
              src={url ?? "/icon.png"}
              className={localIndex == index ? "block" : "hidden"}
              alt={"test"}
              width={400}
              height={400}
              priority
            />
          ))}
        </div>
        {hovered && post.images.length > 1 && (
          <div className="absolute flex justify-between">
            <button
              className="rounded-l bg-secondary px-2 py-1 text-white"
              type="button"
              onClick={() => setIndex((index) => index - 1)}
              disabled={index == 0}
            >
              &lt;
            </button>
            <button
              className="rounded-r bg-secondary px-2 py-1 text-white"
              type="button"
              onClick={() => setIndex((index) => index + 1)}
              disabled={index == post.images.length - 1}
            >
              &gt;
            </button>
          </div>
        )}
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
            Location:
            {" " +
              address.line1 +
              ", " +
              address.line2 +
              ", " +
              address.unitNo +
              ", " +
              address.postal_code}
            <br />
            Quantity: {post.quantity} <br />
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
            {!!post.org && (
              <Link
                href={`/post/collect/${post.id}`}
                className="btn btn-secondary mt-2"
              >
                Jiak!
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;
