"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

type ImageUploadProps = {
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
};

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
}) => {
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  const preset = (process.env.UPLOAD_PRESET as string) || "hvyji3j6";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {value.map((url, index) => (
          <div key={index} className="relative w-[200px] h-[200px]">
            <div className="absolute top-0 right-0 z-10">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                size="sm"
                className="bg-red-500 text-white"
              >
                <Trash className="w-3 h-3" />
              </Button>
            </div>
            <Image
              src={url}
              alt="profile-image"
              fill
              sizes="100%"
              className="object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
      <CldUploadWidget uploadPreset="hvyji3j6" onSuccess={onUpload}>
        {({ open }) => {
          return (
            <Button
              type="button"
              className="bg-gray-500 text-white"
              onClick={() => open()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};
