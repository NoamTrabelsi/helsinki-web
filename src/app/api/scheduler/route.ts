"use server";
import { NextResponse } from "next/server";
import schedule from "node-schedule";

// */10 * * * * - 10 דק
//*/20 * * * * * - 20 שניות

export async function POST() {
  schedule.scheduleJob("*/20 * * * * *", async () => {
    console.log(`Sending request to: http://localhost:3001/api/mailer`);
    try {
      await fetch("http://localhost:3001/api/mailer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error triggering Webhook mailer:", error);
    }
  });
  schedule.scheduleJob("*/20 * * * * *", async () => {
    console.log(`Sending request to: http://localhost:3001/api/mailToSend`);
    try {
      await fetch("http://localhost:3001/api/mailToSend", {
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
