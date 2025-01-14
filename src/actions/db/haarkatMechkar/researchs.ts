"use server";
import * as dbresearchs from "@/lib/db/haarkatMechkar/researchs";

import { catchHandler } from "@/utils/catch-handlers";

export const getResearchr = async ({
  todayPlus91,
  excluded_ids,
}: {
  todayPlus91: Date;
  excluded_ids?: number[];
}) => {
  try {
    return await dbresearchs.getResearch({ todayPlus91,excluded_ids });
  } catch (error: unknown) {
    return catchHandler(error, "action", "get Research");
  }
};
