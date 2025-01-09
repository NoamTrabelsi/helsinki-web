"use server";
import { catchHandler } from "@/utils/catch-handlers";
import { PrismaClient } from "@prisma/client";
const helsinkidb = new PrismaClient();

//add Hl Research Events
export const addF12 = async ({
  research_id,
  research_event_id,
  validity_date,
  contact_hl_id,
}: {
  research_id?: number;
  research_event_id?: number;
  validity_date?: Date;
  contact_hl_id?:number;
}) => {
  try {
    return await helsinkidb.f_12.create({
      data: {
        research_id,
        research_event_id,
        request_date: new Date(),
        validity_date,
        contact_hl_id,
      },
    });
  } catch (error) {
    return catchHandler(error, "DB", "add hl research events");
  }
};
