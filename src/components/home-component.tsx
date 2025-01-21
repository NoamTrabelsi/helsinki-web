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
    </div>
  );
};

export default HomeComponent;
