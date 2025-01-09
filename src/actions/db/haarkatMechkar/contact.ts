"use server";
import * as dbcontacts_hl from "@/lib/db/haarkatMechkar/contacts_hl";
import * as dbcontacts from "@/lib/db/haarkatMechkar/contacts";

import { catchHandler } from "@/utils/catch-handlers";


export const getContact = async ({
    contact_hl_id,
}: {
  lastId?: number;
  contact_hl_id?: number;
  take?: number;
}) => {
  try {
    const contactHl = (await dbcontacts_hl.getContactHl({
      contacts_hl_id: contact_hl_id,
    })) as { data: { contact_id: number } | null };

    if (contactHl?.data === null) {
      catchHandler("ContactHl not found", "action", "get Research");
      return { data: null };
    }
    return await dbcontacts.getContact({
      contact_id: contactHl.data.contact_id,
    });
  } catch (error: unknown) {
    return catchHandler(error, "action", "get Research");
  }
};
