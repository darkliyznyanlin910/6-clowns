import React, { Dispatch, SetStateAction } from "react";
import Image from "next/image";

type Props = {
  images: {
    file: File;
    id: string;
  }[];
  remove: (idToRemove: string) => void;
};

const ImagePreview = ({ images, remove }: Props) => {
  return (
    <div>
      <div className="my-2 grid grid-cols-12 gap-2">
        {images.map((image) => {
          const src = URL.createObjectURL(image.file);
          return (
            <div
              className="relative col-span-4 aspect-video"
              key={image.id}
              onClick={() => remove(image.id)}
            >
              <Image
                src={src}
                alt={image.file.name}
                className="object-cover"
                fill
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImagePreview;
