"use server";
import * as db from "@/lib/db/mailer/mailer";
import { catchHandler } from "@/utils/catch-handlers";

export const getMailers = async ({
  lastId,
  status,
  to,
  subject,
  take,
  body,
  appType,
}: {
  lastId?: number;
  status?: number;
  to?: string;
  subject?: string;
  take?: number;
  body?: string;
  appType?: string;
}) => {
  try {
    return await db.getMailers({
      lastId,
      status,
      to,
      subject,
      take,
      body,
      appType,
    });
  } catch (error: unknown) {
    return catchHandler(error, "action", "get mailers");
  }
};

export const addMailer = async ({
  subject,
  body,
  to,
  cc,
  bcc,
  attachments,
  appType,
  appId,
}: {
  subject: string;
  body: string;
  to: string;
  cc?: string;
  bcc?: string;
  attachments?: string;
  appType: string;
  appId?: string;
}) => {
  try {
    return await db.addMailer({
      subject,
      body,
      to,
      cc,
      bcc,
      attachments,
      appType,
      appId,
    });
  } catch (error) {
    return catchHandler(error, "action", "add mailer");
  }
};

export const updateMailer = async (
  id: number,
  {
    status,
    errCode,
    errMsg,
    sendDate,
    sentDate,
  }: {
    status?: number;
    errCode?: number;
    errMsg?: string;
    sendDate?: Date;
    sentDate?: Date;
  }
) => {
  try {
    return await db.updateMailer(id, {
      status,
      errCode,
      errMsg,
      sendDate,
      sentDate,
    });
  } catch (error: unknown) {
    return catchHandler(error, "action", "update mailer");
  }
};
