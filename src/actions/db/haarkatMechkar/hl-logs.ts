"use server";
import * as db from "@/lib/db/haarkatMechkar/hl-logs";
import { catchHandler } from "@/utils/catch-handlers";

export const addHlLogs = async ({
  module_number,
  contact_id,
}: {
  module_number?: number;
  contact_id?: number;
}) => {
  try {
    return await db.addHlLogs({
      module_number,
      contact_id,
    });
  } catch (error: unknown) {
    return catchHandler(error, "action", "add hl research events");
  }
};
