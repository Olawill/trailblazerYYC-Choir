"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // const router = useRouter();

  return (
    <html>
      <body>
        <div className="grid h-screen px-4 bg-white place-content-center">
          <div className="text-center">
            <h1 className="font-black text-gray-200 text-9xl">{401}</h1>

            <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Unauthroized!
            </p>

            <p className="mt-4 text-gray-500">
              {error.message || "Oops, something went wrong!!"}
            </p>

            <Button
              type="button"
              onClick={() => {
                reset();
                // router.refresh();
              }}
              className="inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring"
            >
              Try Again
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
