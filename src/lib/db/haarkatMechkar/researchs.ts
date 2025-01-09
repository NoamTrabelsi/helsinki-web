"use server";
import { catchHandler } from "@/utils/catch-handlers";
import { PrismaClient } from "@prisma/client";
const helsinkidb = new PrismaClient();

// get research
export const getResearch = async ({ todayMin91 }: { todayMin91: Date }) => {
  try {
    const research = await helsinkidb.researchs.findFirst({
      where: {
        status_id:3,
        end_date: {
          gte: todayMin91, 
          lte:new Date()
        },
      },
    });
    return { data: research };
  } catch (error) {
    return catchHandler(error, "DB", "get Research");
  }
};
