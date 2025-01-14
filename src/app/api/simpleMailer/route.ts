"use server";
import { catchHandler } from "@/utils/catch-handlers";
import nodemailer from "nodemailer";
import { validEmails } from "../mailer/attachment";

export async function POST(request: Request) {
  let transporter;
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } catch (error) {
    catchHandler(error, "webhook - mailer", "create transport");
  }
  if (!transporter) {
    catchHandler("error", "webhook - mailer", "create transport");
    return Response.json({ message: "transport is null" }, { status: 500 });
  }
  let mailer;
  try {
    const answer = await request.text();    
    mailer = JSON.parse(answer);
  } catch (error) {
    catchHandler(error, "webhook - mailer", "get mailer");
  }

  console.log(mailer);

  if (mailer) {
    const { to, subject, body, attachments } = mailer;
    const arrTo = to.split(";").map((email: string) => email.trim());
    let toArray = validEmails(to);
    if (toArray) {
      toArray = arrTo;
    }
    try {
      await transporter.sendMail({
        from: process.env.NEXT_PUBLIC_EMAIL_TO,
        to: toArray,
        subject: subject || "No Subject",
        attachments: [
          {
            filename: "encoded.pdf",
            content: Buffer.from(attachments, "base64") ,
            encoding: "base64",
          },
        ],
        html: body,
      });
    } catch (error) {
      catchHandler(error, "webhook - mailer", "send mailer");
      return Response.json({ message: "Failed to send" }, { status: 500 });
    }
    return Response.json({ data: new Date() }, { status: 200 });
  }
  return Response.json(
    { message: "there is no mail to send" },
    { status: 500 }
  );
}
