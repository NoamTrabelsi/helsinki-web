"use server";
import { getMailer, updateMailer } from "@/actions/db/mailer/mailer";
import { catchHandler } from "@/utils/catch-handlers";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getAttachments, validEmails } from "./attachment";
import { sleep } from "@/utils/sleep";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST() {
  if (!transporter) {
    catchHandler("error", "webhook - mailer", "create transport");
    return NextResponse.json({ message: "transport is null" }, { status: 500 });
  }
  while (true) {
    let mailer;
    try {
      const answer = (await getMailer({ status: 1 })) as {
        data: {
          id: number;
          to: string;
          cc: string;
          bcc: string;
          subject: string;
          body: string;
          attachments: string;
          appType: string;
        };
      };
      mailer = answer?.data;
    } catch (error) {
      catchHandler(error, "webhook - mailer", "get mailer");
      return NextResponse.json(
        { message: "Failed to get mailer" },
        { status: 500 }
      );
    }
    if (mailer) {
      const { id, to, cc, bcc, subject, body, attachments, appType } = mailer;
      const arrTo = to.split(";").map((email: string) => email.trim());
      let toArray = validEmails(to);
      const ccArray = cc ? validEmails(cc) : [];
      const bccArray = bcc ? validEmails(bcc) : [];
      let errMail = "נשלח בהצלחה\n";
      const def = arrTo.filter((item: string) => !toArray.includes(item));
      if (def.length > 1) {
        errMail += `אך יש שגיאות במיילים הבאים : ${def} \n`;
      }
      if (toArray) {
        toArray = arrTo;
      }
      let validAttachment;
      if (attachments) {
        const arrAttachments = await getAttachments(attachments, appType);
        const { validAttachments, invalidMessages } = arrAttachments;
        validAttachment = validAttachments;
        if (invalidMessages && invalidMessages.length > 0) {
          errMail +=
            "ישנם קבצים שלא נמצאו : " +
            `Attachment ID ${invalidMessages} has no filename`;
        }
      }
      try {        
        await transporter.sendMail({
          from: process.env.NEXT_PUBLIC_EMAIL_TO,
          to: toArray,
          cc: ccArray || undefined,
          bcc: bccArray || undefined,
          subject: subject || "No Subject",
          attachments: validAttachment ? validAttachment : undefined,
          html: body,
        });
        try {
          await updateMailer(id, {
            status: 2,
            errCode: 200,
            errMsg: errMail,
            sentDate: new Date(),
          });
        } catch (error) {
          catchHandler(error, "webhook - mailer", "update mailer");
          return NextResponse.json(
            { message: "Failed to update mailer" },
            { status: 500 }
          );
        }
      } catch (error) {
        catchHandler(error, "webhook - mailer", "send mailer");
        try {
          const err = JSON.parse(JSON.stringify(error));
          await updateMailer(id, {
            status: 2,
            errCode: err.responseCode ? err.responseCode : 500,
            errMsg: err.response ? err.response : "Something went wrong",
          });
        } catch (err) {
          catchHandler(err, "webhook - mailer", "update mailer");
          return NextResponse.json(
            { message: "Failed to update mailer" },
            { status: 500 }
          );
        }
      }
      await sleep(2000);
    } else {
      transporter.close();
      return NextResponse.json({ message: "sleep" }, { status: 200 });
    }
  }
}
