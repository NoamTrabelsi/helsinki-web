"use server";
import { catchHandler } from "@/utils/catch-handlers";
import { PrismaClient } from "@prisma/client";
const helsinkidb = new PrismaClient();

// get Mail To Send
export const getMailToSend = async () => {
  try {
    const mailToSend = await helsinkidb.mail_to_send.findFirst({
      where: {
        mail_date: {
          lte: new Date(),
        },
      },
      orderBy: {
        id: "desc",
      },
    });
    return { data: mailToSend };
  } catch (error) {
    return catchHandler(error, "DB", "get Mail To Send");
  }
};

//update Mail To Send
export const updateMailToSend = async (
  id: number,
  {
    mail_date,
  }: {
    mail_date?: Date;
  }
) => {
  try {
    const mailToSend = await helsinkidb.mail_to_send.update({
      where: { id },
      data: {
        mail_date,
      },
    });
    return {
      data: mailToSend,
    };
  } catch (err: unknown) {
    return catchHandler(err, "DB", "update Mail To Send");
  }
};

//delete Mail To Send
export const deleteMailToSend = async (id: number) => {
  try {
    return await helsinkidb.mail_to_send.delete({
      where: { id },
    });
  } catch (err: unknown) {
    return catchHandler(err, "DB", "delete Mail To Send");
  }
};
