"use server";
import { catchHandler } from "@/utils/catch-handlers";
import { PrismaClient } from "@prisma/client";
const helsinkidb = new PrismaClient();

// get research
export const getResearch = async ({
  todayPlus91,
  excluded_ids,
}: {
  todayPlus91: Date;
  excluded_ids?: number[];
}) => {
  try {
    const research = await helsinkidb.researchs.findFirst({
      where: {
        status_id: 3,
        end_date: {
          lte: todayPlus91,
          gt: new Date(),
        },
        ...(excluded_ids && excluded_ids.length > 0
          ? { research_id: { notIn: excluded_ids } }
          : {}),
      },
    });
    return { data: research };
  } catch (error) {
    return catchHandler(error, "DB", "get Research");
  }
};
