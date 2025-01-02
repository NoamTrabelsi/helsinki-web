"use server";
import * as db from "@/lib/db/sendToProfessorAI/send-to-professor-ai";
import { catchHandler } from "@/utils/catch-handlers";

export const getSendProfessorAI = async ({
  lastId,
  take,
}: {
  lastId?: number;
  take?: number;
}) => {
  try {
    return await db.getSendProfessorAI({
      lastId,
      take,
    });
  } catch (error: unknown) {
    return catchHandler(error, "action", "get Send To professorAI");
  }
};

export const updateSendToProfessorAI = async (
  id: number,
  {
    analysis,
    status,
    errCode,
    errMsg,
  }: {
    analysis?: string;
    status?: number;
    errCode?: number;
    errMsg?: string;
  }
) => {
  try {
    return await db.updateSendToProfessorAI(id, {
      analysis,
      status,
      errCode,
      errMsg,
    });
  } catch (error: unknown) {
    return catchHandler(error, "action", "update Send To professorAI");
  }
};
