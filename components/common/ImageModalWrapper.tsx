"use client";

import { useState } from "react";
import ImageViewerModal from "../modals/ImageViewerModal";

const ImageModalWrapper = ({
  imageSrc,
  children,
}: {
  imageSrc: string;
  children: (setOpen: (open: boolean) => void) => React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ImageViewerModal
        open={open}
        setOpen={setOpen}
        imageSrc={imageSrc}
      />
      {children(setOpen)}
    </>
  );
};

export default ImageModalWrapper;
