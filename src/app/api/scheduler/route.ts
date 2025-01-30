"use server";
import { NextResponse } from "next/server";
import schedule from "node-schedule";

// */10 * * * * - 10 דק
//*/20 * * * * * - 20 שניות

export async function POST() {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  schedule.scheduleJob("*/10 * * * *", async () => {
    console.log(`Sending request to:mailer`);
    try {
      await fetch(`${baseUrl}/api/mailer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error triggering Webhook mailer:", error);
    }
  });
  schedule.scheduleJob("*/10 * * * *", async () => {
    console.log(`Sending request to: mailToSend`);
    try {
      await fetch(`${baseUrl}/api/mailToSend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error triggering Webhook mailToSend:", error);
    }
  });
  return NextResponse.json({
    success: "success",
    message: "Webhooks triggered successfully",
  });
}
