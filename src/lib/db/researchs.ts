"use server";
import { catchHandler } from "@/utils/catch-handlers";
import { PrismaClient } from "@prisma/client";
const helsinkidb = new PrismaClient();

// get research
export const getResearch = async ({
  research_id,
}: {
  research_id?: number;
}) => {
  try {
    const research = await helsinkidb.researchs.findFirst({
      where: { research_id },
    });
    return { data: research };
  } catch (error) {
    return catchHandler(error, "DB", "get Research");
  }
};
