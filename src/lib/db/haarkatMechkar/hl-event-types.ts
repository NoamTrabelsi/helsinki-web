"use server";
import { catchHandler } from "@/utils/catch-handlers";
import { PrismaClient } from "@prisma/client";
const helsinkidb = new PrismaClient();

// get HlEventTypes
export const getHlEventTypes = async ({ hl_event_type_id }: { hl_event_type_id?: number }) => {
  try {
    const eventTypes = await helsinkidb.hl_event_types.findFirst({
      where: { hl_event_type_id },
    });
    return { data: eventTypes };
  } catch (error) {
    return catchHandler(error, "DB", "get contacts");
  }
};
