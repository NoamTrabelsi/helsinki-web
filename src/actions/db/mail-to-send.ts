"use server";
import * as db from "@/lib/db/mail-to-send";
import { catchHandler } from "@/utils/catch-handlers";

export const getMailToSend = async ({lastId,take}: { lastId?: number; take?: number }) => {
  try {
    return await db.getMailToSend({lastId,take});
  } catch (error: unknown) {
    return catchHandler(error, "action", "get Mail To Send");
  }
};

export const updateMailToSend = async (
  id: number,
  {
    mail_date,
  }: {
    mail_date?: Date;
  }
) => {
  try {
    return await db.updateMailToSend(id, { mail_date });
  } catch (error: unknown) {
    return catchHandler(error, "action", "update Mail To Send");
  }
};

export const deleteMailToSend = async (id: number) => {
  try {
    return await db.deleteMailToSend(id);
  } catch (error: unknown) {
    return catchHandler(error, "action", "delete Mail To Send");
  }
};
