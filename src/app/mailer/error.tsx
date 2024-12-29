"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  let title;
  let description;

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const err = JSON.parse(error.message);

  if (error.digest) {
    title = `Error digest: ${error.digest}`;
    description = err.message;
  } else if (err) {
    title = `${err.type} Error ! (${err.fanctionName})`;
    description = err.message;
  } else if (!err) {
    title = "Error Message !";
    description = err.message;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="max-w-xl w-full">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>
            {description}
          </AlertDescription>
        </Alert>
      </div>
      <div className="mt-4">
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => {
              reset();
              router.refresh();
            }
          }
        >
          נסה שוב
        </Button>
      </div>
    </div>
  );
}
