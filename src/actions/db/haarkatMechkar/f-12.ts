"use server";
import * as db from "@/lib/db/haarkatMechkar/f-12";
import { catchHandler } from "@/utils/catch-handlers";

export const addF12 = async ({
  research_id,
  research_event_id,
  validity_date,
  contact_hl_id,
}: {
  research_id?: number;
  research_event_id?: number;
  validity_date?: Date;
  contact_hl_id?: number;
}) => {
  try {
    return await db.addF12({
      research_id,
      research_event_id,
      validity_date,
      contact_hl_id,
    });
  } catch (error: unknown) {
    return catchHandler(error, "action", "add hl research events");
  }
};
