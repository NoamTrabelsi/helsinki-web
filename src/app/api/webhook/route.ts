"use server";
import { catchHandler } from "@/utils/catch-handlers";
import { NextResponse } from "next/server";

export async function POST() {
  const webhooks = [
    "http://localhost:3001/api/mailer",
    "http://localhost:3001/api/mailToSend",
  ];
  console.log("start webhooks");

  try {
    await Promise.all(
      webhooks.map(async (webhook) => {
        console.log(`Sending request to: ${webhook}`);
        try {
          await fetch(webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          catchHandler(error, "API", `Error while calling ${webhook}`);
        }
      })
    );
    return NextResponse.json({
      success: "success",
      message: "Webhooks triggered successfully",
    });
  } catch (error) {
    catchHandler(error, "API", "Failed to parse request body");
    return NextResponse.json(
      { error: "Failed", message: "Invalid request body" },
      { status: 400 }
    );
  }
}
