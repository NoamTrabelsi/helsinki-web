"use server";
import { catchHandler } from "@/utils/catch-handlers";
import { PrismaClient } from "@prisma/client";
const helsinkidb = new PrismaClient();

// get Contact
export const getContact = async ({ contact_id }: { contact_id?: number }) => {
  try {
    const contacts = await helsinkidb.contacts.findFirst({
      where: { contact_id },
    });
    return { data: contacts };
  } catch (error) {
    return catchHandler(error, "DB", "get contacts");
  }
};
