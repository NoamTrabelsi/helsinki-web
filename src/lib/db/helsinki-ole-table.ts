"use server";
import { catchHandler } from "@/utils/catch-handlers";
import { PrismaClient } from "@prisma/client";
const helsinkidb = new PrismaClient();


// get ole table
export const getOleTable = async ({ id }: { id?: number }) => {
  try {
    const oleTable = await helsinkidb.ole_table.findFirst({
      where: { id },
    });
    return { data: oleTable };
  } catch (error) {
    return catchHandler(error, "DB", "get ole Table");
  }
};
