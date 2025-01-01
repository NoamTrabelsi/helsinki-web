"use server";
import { catchHandler } from "@/utils/catch-handlers";
import { PrismaClient } from "@prisma/client";
const helsinkidb = new PrismaClient();

// get Contact hl
export const getContactHl = async ({
  contacts_hl_id,
}: {
  contacts_hl_id?: number;
}) => {
  try {
    const contactsHl = await helsinkidb.contacts_hl.findFirst({
      where: { contacts_hl_id },
    });
    return { data: contactsHl };
  } catch (error) {
    return catchHandler(error, "DB", "get ContactHl");
  }
};
