"use server";
import { catchHandler } from "@/utils/catch-handlers";
import { PrismaClient } from "@prisma/client";
const helsinkidb = new PrismaClient();

// get global Paramenters
export const getGlobalParamenters = async ({
  site_id,
  tbl_link_id,
}: {
  site_id?: number;
  tbl_link_id?: number;
}) => {
  try {
    const globalParamenters = await helsinkidb.global_paramenters.findFirst({
      where: { site_id, tbl_link_id },
    });
    return { data: globalParamenters };
  } catch (error) {
    return catchHandler(error, "DB", "get global paramenters");
  }
};
