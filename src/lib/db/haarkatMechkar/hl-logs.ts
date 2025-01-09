"use server";
import { catchHandler } from "@/utils/catch-handlers";
import { PrismaClient } from "@prisma/client";
const helsinkidb = new PrismaClient();

//add Hl Research Events
export const addHlLogs = async ({
  module_number,
  contact_id,
}: {
  module_number?: number;
  contact_id?: number;
}) => {
  try {
    return await helsinkidb.hl_logs.create({
      data: {
        module_type: 7,
        module_number,
        contact_id,
        log_DateTime: new Date(),
        new_value2: "ארוע נפתח אוטומטית מ - PM7",
        ctrl_name: "ארוע נפתח אוטומטית מ - PM7",
      },
    });
  } catch (error) {
    return catchHandler(error, "DB", "add hl research events");
  }
};
