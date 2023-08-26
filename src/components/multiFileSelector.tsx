import React, { ComponentPropsWithRef } from "react";

type Props = ComponentPropsWithRef<"input">;

const MultiFileSelector = (props: Props) => {
  return <input {...props} type="file" multiple className={""} />;
};

export default MultiFileSelector;
