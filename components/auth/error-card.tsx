import { CardWrapper } from "@/components/auth/card-wrapper";
import { TriangleAlert } from "lucide-react";

const ErrorCard = () => {
  return (
    <CardWrapper
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
      headerLabel="Oops! Something went wrong!"
    >
      <div className="flex items-center justify-center">
        <TriangleAlert className="text-destructive h-8 w-8" />
      </div>
    </CardWrapper>
  );
};

export default ErrorCard;
