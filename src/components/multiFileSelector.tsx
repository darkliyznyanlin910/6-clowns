import { Upload } from "lucide-react";
import React, { type ComponentPropsWithRef } from "react";

type Props = ComponentPropsWithRef<"input"> & {
  count: number;
};

const MultiFileSelector = ({ count, ...props }: Props) => {
  return (
    <label className="flex h-24 w-full cursor-pointer items-center justify-center rounded-lg border-2 bg-white">
      <input
        {...props}
        type="file"
        multiple
        placeholder="test"
        className="w-full"
      />
      <Upload />
      <br />
      {count > 0 && (
        <p className="text-xs">
          {count} file{count > 1 && "s"} selected
        </p>
      )}
    </label>
  );
};

export default MultiFileSelector;
