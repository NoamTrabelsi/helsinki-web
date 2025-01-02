"use server";
import { catchHandler } from "@/utils/catch-handlers";
import { PrismaClient } from "@prisma/client";
const helsinkidb = new PrismaClient();

// get General Hl Table
export const getGeneralHlTable = async ({
  type_number,
}: {
  type_number?: number;
}) => {
  try {
    const mailer = await helsinkidb.general_hl_table.findFirst({
      where: { order_id: type_number, general_id: 32 },
    });
    return { data: mailer };
  } catch (error) {
    return catchHandler(error, "DB", "get General Hl Table");
  }
};
