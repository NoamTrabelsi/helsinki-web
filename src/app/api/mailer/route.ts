"use server";
import { getMailers, updateMailer } from "@/actions/db/mailer";
import { catchHandler } from "@/utils/catch-handlers";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getAttachments, validEmails } from "./attachment";

export async function POST() {
  try {
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
      return NextResponse.json(
        { message: "transport is null" },
        { status: 500 }
      );
    }
    const now = new Date();
    const answer = await getMailers({ status: 1 });
    const mailers = answer?.data;
    if (!Array.isArray(mailers) || mailers.length === 0) {
      return NextResponse.json(
        { error: "Request body must be a non-empty array of emails" },
        { status: 400 }
      );
    }

    const results: boolean[] = [];
    for (const mailer of mailers) {
      const { id, to, cc, bcc, subject, body, attachments } = mailer;
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
        toArray = to;
      }
      let validAttachment;
      if (attachments) {
        const arrAttachments = await getAttachments(
          attachments,
          mailer.appType
        );
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
            sentDate: now,
          });
          results.push(true);
        } catch (err) {
          catchHandler(err, "API", "update mailer");
          results.push(false);
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
        results.push(false);
      }
    }

    const sendMails = results.filter((result) => !!result);
    const unSendMails = results.filter((result) => !result);
    return NextResponse.json(
      {
        message: `Emails sent successfully: ${sendMails.length}, emails not sent successfully: ${unSendMails.length}`,
      },
      { status: 200 }
    );
  } catch (error) {
    catchHandler(error, "API", "send mailer");
    return NextResponse.json(
      { message: "Failed to send email", error: error },
      { status: 500 }
    );
  }
}
