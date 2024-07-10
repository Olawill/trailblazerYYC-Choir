import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export const Header = ({ label }: HeaderProp) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className={cn("text-3xl font-semibold", poppins.className)}>
        TrailBlazer YYC 🎶
      </h1>
      {label && <p className="text-muted-foreground text-sm">{label}</p>}
    </div>
  );
};
