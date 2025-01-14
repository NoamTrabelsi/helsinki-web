"use server";
import { catchHandler } from "@/utils/catch-handlers";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { validEmails } from "../mailer/attachment";

export async function POST(req: Request) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  if (!transporter) {
    catchHandler("error", "webhook - mailer", "create transport");
    return Response.json({ message: "transport is null" }, { status: 500 });
  }
  const answer = await req.text();
  const mailer = JSON.parse(answer);
  console.log(mailer);

  if (mailer) {
    const { to, subject, body, attachments } = mailer;
    const arrTo = to.split(";").map((email: string) => email.trim());
    let toArray = validEmails(to);
    let errMail = "נשלח בהצלחה\n";
    const def = arrTo.filter((item: string) => !toArray.includes(item));
    if (def.length > 1) {
      errMail += `אך יש שגיאות במיילים הבאים : ${def} \n`;
    }
    if (toArray) {
      toArray = arrTo;
    }
    try {
      await transporter.sendMail({
        from: process.env.NEXT_PUBLIC_EMAIL_TO,
        to: toArray,
        subject: subject || "No Subject",
        attachments: attachments || undefined,
        html: body,
      });
    } catch (error) {
      catchHandler(error, "webhook - mailer", "send mailer");
      return Response.json({ message: "Failed to send" }, { status: 500 });
    }
    return Response.json({ data: new Date() }, { status: 200 });
  }
  return Response.json({ message: "there is no mail to send" }, { status: 500 });
}
