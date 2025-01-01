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
    const mailer = await helsinkidb.send_to_professor_AI.findFirst({
      where: { send_date: null },
      take: take || 100,
      skip: lastId ? 1 : 0, // Skip the last record
      cursor: lastId ? { id: lastId } : undefined, // Start after the last fetched record
      orderBy: {
        id: "desc",
      },
    });
    return { data: mailer };
  } catch (error) {
    return catchHandler(error, "DB", "get Send To Prof");
  }
};

//update Send To Prof
export const updateSendToProfessorAI = async (
  id: number,
  {
    analysis,
  }: {
    analysis?: string;
  }
) => {
  try {
    const mailer = await helsinkidb.send_to_professor_AI.update({
      where: { id: id },
      data: {
        send_date: new Date(),
        analysis,
      },
    });
    return {
      data: mailer,
    };
  } catch (err: unknown) {
    return catchHandler(err, "DB", "update Send To Prof");
  }
};
