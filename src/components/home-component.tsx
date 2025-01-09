"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const HomeComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">דף בית - Helsinki</h1>
      <Button asChild>
        <Link href="/mailer">עבור לדף ניהול המיילים</Link>
      </Button>
      <h1>כפתורים להפעלה מיידית של התהליכים, ללא צורך בהמתנה </h1>
      <Button
        onClick={async () => {
          await fetch("/api/mailer", {
            method: "POST",
          });
        }}
      >
        MAILER - הפעלה של
      </Button>
      <Button
        onClick={async () => {
          await fetch("/api/mailToSend", {
            method: "POST",
          });
        }}
      >
        mailToSend - הפעלה של
      </Button>
    </div>
  );
};

export default HomeComponent;
