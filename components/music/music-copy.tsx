"use client";

import { CheckCheck, Clipboard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRef, useState } from "react";

export const MusicCopy = ({ link }: { link: string }) => {
  const [isCopied, setIsCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const copy = async () => {
    if (inputRef.current) {
      await navigator.clipboard.writeText(link);

      // Select the text in the input field
      inputRef.current.select();
      inputRef.current.setSelectionRange(0, 99999); // For mobile devices

      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2500);
    }
  };

  const Icon = isCopied ? CheckCheck : Clipboard;

  return (
    <div
      className={`px-1 border rounded-sm flex items-center ${
        link ? "justify-between" : "justify-center italic font-medium"
      }`}
    >
      {link ? (
        <>
          <Input
            defaultValue={link}
            className="focus-visible:ring-px border-none"
            ref={inputRef}
          />
          <Badge
            variant={isCopied ? "success" : "default"}
            className="py-2 mr-1 cursor-pointer"
            onClick={copy}
          >
            <Icon className="w-3 h-3 mr-1" />
            <span>{isCopied ? "Copied" : "Copy"}</span>
          </Badge>
        </>
      ) : (
        "No URL available for this album"
      )}
    </div>
  );
};
