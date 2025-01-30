"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const HomeComponent = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">דף בית - Helsinki</h1>
      <Button asChild>
        <Link href={`${baseUrl}/mailer`}>עבור לדף ניהול המיילים</Link>
      </Button>
    </div>
  );
};

export default HomeComponent;
