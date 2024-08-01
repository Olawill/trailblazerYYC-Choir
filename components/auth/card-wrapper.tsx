"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { BackButton } from "@/components/auth/back-button";
import { Header } from "@/components/auth/header";
import { Social } from "@/components/auth/socials";
import { Separator } from "@/components/ui/separator";
import { CardWrapperProp } from "@/lib/types";

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProp) => {
  return (
    <Card className="w-[350px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter className="flex flex-col gap-y-4">
          <div className="text-sm font-normal w-full italic flex items-center gap-x-2 text-gray-500">
            <Separator className="w-[45%]" />
            <span>or</span>
            <Separator className="w-[45%]" />
          </div>
          <Social />
        </CardFooter>
      )}

      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};
