import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="max-w-xl w-full">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>הדף לא נמצא</AlertTitle>
          <AlertDescription>לא ניתן למצוא את הדף המבוקש</AlertDescription>
        </Alert>
      </div>
      <div className="mt-4">
        <Button asChild>
          <Link href="/">חזור לדף הבית</Link>
        </Button>
      </div>
    </div>
  );
}
