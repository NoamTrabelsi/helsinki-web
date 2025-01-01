"use server";
import * as db from "@/lib/db/sendToProfesorAI/send-to-profesor-ai";
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
    return catchHandler(error, "action", "get Send To Prof");
  }
};

export const updateSendToProfessorAI = async (
  id: number,
  {
    analysis,
  }: {
    analysis?: string;
  }
) => {
  try {
    return await db.updateSendToProfessorAI(id, {
      analysis,
    });
  } catch (error: unknown) {
    return catchHandler(error, "action", "update Send To Prof");
  }
};
