"use server";
import * as dbresearchs from "@/lib/db/haarkatMechkar/researchs";

import { catchHandler } from "@/utils/catch-handlers";

export const getResearchr = async () => {
  try {
    const todayMin91 = new Date();
    todayMin91.setDate(todayMin91.getDate() - 91);
    return await dbresearchs.getResearch({ todayMin91 });
  } catch (error: unknown) {
    return catchHandler(error, "action", "get Research");
  }
};
