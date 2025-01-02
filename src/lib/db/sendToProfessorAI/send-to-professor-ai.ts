"use server";
import { catchHandler } from "@/utils/catch-handlers";
import { PrismaClient } from "@prisma/client";
const helsinkidb = new PrismaClient();

// get Send To Prof
export const getSendProfessorAI = async ({
  lastId,
  take,
}: {
  lastId?: number;
  take?: number;
}) => {
  try {
    const professorAI = await helsinkidb.send_to_professor_AI.findFirst({
      where: { status: null },
      take: take || 100,
      skip: lastId ? 1 : 0, // Skip the last record
      cursor: lastId ? { id: lastId } : undefined, // Start after the last fetched record
      orderBy: {
        id: "desc",
      },
    });
    return { data: professorAI };
  } catch (error) {
    return catchHandler(error, "DB", "get Send To professorAI");
  }
};

//update Send To Prof
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
    const professorAI = await helsinkidb.send_to_professor_AI.update({
      where: { id: id },
      data: {
        send_date: new Date(),
        analysis,
        status,
        errCode,
        errMsg,
      },
    });
    return {
      data: professorAI,
    };
  } catch (err: unknown) {
    return catchHandler(err, "DB", "update Send To professorAI");
  }
};
