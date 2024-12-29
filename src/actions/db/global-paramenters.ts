"use server";
import * as db from "@/lib/db/global-paramenters";
import { catchHandler } from "@/utils/catch-handlers";

export const getGlobalParamenters = async ({
  site_id,
  tbl_link_id,
}: {
  site_id?: number;
  tbl_link_id?: number;
}) => {
  try {
    return await db.getGlobalParamenters({ site_id, tbl_link_id });
  } catch (error: unknown) {
    return catchHandler(error, "action", "get Global Paramenters");
  }
};
