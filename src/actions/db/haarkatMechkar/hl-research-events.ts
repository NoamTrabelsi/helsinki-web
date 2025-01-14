"use server";
import * as db from "@/lib/db/haarkatMechkar/hl-research-events";
import { catchHandler } from "@/utils/catch-handlers";

export const getHlResearchEvents = async ({
  research_id,
  todayPlus91,
}: {
  research_id?: number;
  todayPlus91: Date;
}) => {
  try {
    return await db.getHlResearchEvents({ research_id, todayPlus91 });
  } catch (error: unknown) {
    return catchHandler(error, "action", "get hl research events");
  }
};

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
    return await db.addHlResearchEvents({
      research_id,
      content,
      writer_id,
      report_date,
    });
  } catch (error: unknown) {
    return catchHandler(error, "action", "add hl research events");
  }
};
