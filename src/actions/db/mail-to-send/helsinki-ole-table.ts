"use server";
import * as db from "@/lib/db/mailToSend/helsinki-ole-table";
import { catchHandler } from "@/utils/catch-handlers";


// get ole table
export const getOleTable = async ({ id }: { id?: number }) => {
  try {
    return await db.getOleTable({id});
  } catch (error) {
    return catchHandler(error, "action", "get contacts");
  }
};
