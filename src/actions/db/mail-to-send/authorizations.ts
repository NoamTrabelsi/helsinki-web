"use server";
import * as dbauthorizations from "@/lib/db/mailToSend/authorizations";
import * as dbcontacts from "@/lib/db/mailToSend/contacts";

import { catchHandler } from "@/utils/catch-handlers";

export const getAuthorizations = async ({
  research_id,
}: {
  lastId?: number;
  research_id?: number;
  take?: number;
}) => {
  try {
    const authorizations = (await dbauthorizations.getAuthorizations({
      research_id,
    })) as { data: { contact_id: number } | null };
    if (!authorizations?.data) {
      catchHandler("Authorizations not found", "action", "get Authorizations");
      return { data: null };
    }
    return await dbcontacts.getContact({
      contact_id: authorizations.data.contact_id,
    });
  } catch (error: unknown) {
    return catchHandler(error, "action", "get Authorizations");
  }
};
