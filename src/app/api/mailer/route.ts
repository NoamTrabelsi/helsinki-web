"use server";
import { getMailer, updateMailer } from "@/actions/db/mailer/mailer";
import { catchHandler } from "@/utils/catch-handlers";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getAttachments, validEmails } from "./attachment";
import { sleep } from "@/utils/sleep";

const interval = 10 * 60 * 1000; //10 דק

export async function POST() {
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
    catchHandler("error", "API", "create transport");
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
      catchHandler(error, "API", "get mailer");
    }
    if (mailer) {
      const { id, to, cc, bcc, subject, body, attachments, appType } = mailer;
      const arrTo = to.split(";").map((email: string) => email.trim());
      let toArray = validEmails(to);
      const ccArray = cc ? validEmails(cc) : [];
      const bccArray = bcc ? validEmails(bcc) : [];
      let errMail = "נשלח בהצלחה\n";
      const def = arrTo.filter((item: string) => !toArray.includes(item));
      if (def.length > 0) {
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
          attachments: validAttachment || undefined,
          html: body,
        });
        try {
          await updateMailer(id, {
            status: 2,
            errCode: 200,
            errMsg: errMail,
            sentDate: new Date(),
          });
        } catch (err) {
          catchHandler(err, "API", "update mailer");
        }
      } catch (err) {
        catchHandler(err, "API", "send mailer");
        try {
          const error = JSON.parse(JSON.stringify(err));
          await updateMailer(id, {
            status: 2,
            errCode: error.responseCode,
            errMsg: error.response,
          });
        } catch (err) {
          catchHandler(err, "API", "update mailer");
        }
      }
      await sleep(2000);
    } else {
      await sleep(interval);
    }
  }
}

