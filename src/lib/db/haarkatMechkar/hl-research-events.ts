"use server";
import { catchHandler } from "@/utils/catch-handlers";
import { PrismaClient } from "@prisma/client";
const helsinkidb = new PrismaClient();

//get Hl Research Events
export const getHlResearchEvents = async ({
  research_id,
  todayMin91,
}: {
  research_id?: number;
  todayMin91: Date;
}) => {
  try {
    return await helsinkidb.hl_research_events.findFirst({
      where: {
        research_id,
        report_date: {
          gte: todayMin91,
          lte: new Date(),
        },
      },
    });
  } catch (error) {
    return catchHandler(error, "DB", "get hl research events");
  }
};

//add Hl Research Events
export const addHlResearchEvents = async ({
  research_id,
  content,
  writer_id,
  report_date,
}: {
  research_id?: number;
  content?: string;
  writer_id?: number;
  report_date?: Date;
}) => {
  try {
    return await helsinkidb.hl_research_events.create({
      data: {
        research_id,
        content,
        writer_id,
        report_date,
        event_date: new Date(),
        writing_date: new Date(),
        event_type_id: 12,
        care_type_id: 0,
        event_status: 1,
        before_confirm: 0,
        is_ready: 0,
      },
    });
  } catch (error) {
    return catchHandler(error, "DB", "add hl research events");
  }
};
