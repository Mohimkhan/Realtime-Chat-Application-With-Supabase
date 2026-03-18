"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

interface ImageViewerModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  imageSrc: string;
}

const ImageViewerModal = ({
  open = false,
  setOpen,
  imageSrc,
}: ImageViewerModalProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent className="flex flex-col justify-center items-start h-[60vh] min-h-[300px] w-[calc(100%-3rem)] sm:w-max max-w-lg py-[35px]">
        <DialogHeader>
          <DialogTitle>Picture Mode</DialogTitle>
        </DialogHeader>
        <Image
          src={imageSrc}
          alt="Picture Mode"
          width={500}
          height={500}
          className="w-full h-full rounded-lg max-w-md object-contain"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=="
          placeholder="blur"
          quality={100}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewerModal;
