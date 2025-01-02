"use server";
import * as db from "@/lib/db/sendToProfessorAI/general-hl-table";
import { catchHandler } from "@/utils/catch-handlers";

export const getGeneralHlTable = async ({
  type_number,
}: {
  type_number?: number;
}) => {
  try {
    return await db.getGeneralHlTable({
      type_number
    });
  } catch (error: unknown) {
    return catchHandler(error, "action", "get General Hl Table");
  }
};
