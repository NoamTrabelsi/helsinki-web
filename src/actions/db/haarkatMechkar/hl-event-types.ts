"use server";
import * as db from "@/lib/db/haarkatMechkar/hl-event-types";
import { catchHandler } from "@/utils/catch-handlers";

export const getHlEventTypes = async ({
  hl_event_type_id,
}: {
  hl_event_type_id?: number;
}) => {
  try {
    return await db.getHlEventTypes({
      hl_event_type_id,
    });
  } catch (error: unknown) {
    return catchHandler(error, "action", "add hl research events");
  }
};
