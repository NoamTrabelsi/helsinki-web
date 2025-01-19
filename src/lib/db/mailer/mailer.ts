"use server";
import { catchHandler } from "@/utils/catch-handlers";
import { PrismaClient } from "@prisma/client";
const helsinkidb = new PrismaClient();

// get mailer
export const getMailer = async ({ status }: { status?: number }) => {
  try {
    const mailer = await helsinkidb.mailer.findFirst({
      where: {
        AND: [
          { status },
          {
            sendDate: {
              lte: new Date(),
            },
          },
        ],
      },
      orderBy: {
        id: "asc",
      },
    });
    return { data: mailer };
  } catch (error) {
    return catchHandler(error, "DB", "get mailer");
  }
};

// get mailers
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
    const mailer = await helsinkidb.mailer.findMany({
      where: {
        AND: [
          {
            OR: [
              { to: { contains: to } },
              { cc: { contains: to } },
              { bcc: { contains: to } },
            ],
          },
          { status },
          {
            sendDate: {
              lte: new Date(),
            },
          },
          { appType },
          {
            subject: {
              contains: subject,
            },
          },
          {
            body: {
              contains: body,
            },
          },
        ],
      },
      take: take || 20,
      skip: lastId ? 1 : 0, // Skip the last record
      cursor: lastId ? { id: lastId } : undefined, // Start after the last fetched record
      orderBy: {
        id: "desc",
      },
    });
    return { data: mailer };
  } catch (error) {
    return catchHandler(error, "DB", "get mailers");
  }
};

// add Mailer
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
    return await helsinkidb.mailer.create({
      data: {
        createdAt: new Date(),
        updatedAt: new Date(),
        subject: subject,
        body: body,
        to: to,
        cc: cc,
        bcc: bcc,
        sendDate: new Date(),
        attachments: attachments,
        status: 1,
        appType: appType,
        appId: appId,
      },
    });
  } catch (error) {
    return catchHandler(error, "DB", "add mailer");
  }
};

//update Mailer
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
    const mailer = await helsinkidb.mailer.update({
      where: { id: id },
      data: {
        status,
        sendDate,
        sentDate,
        errCode,
        errMsg,
        retryNumbers: {
          increment: 1,
        },
      },
    });
    return {
      data: mailer,
    };
  } catch (err: unknown) {
    return catchHandler(err, "DB", "update mailer");
  }
};
