"use server";
import { catchHandler } from "@/utils/catch-handlers";
import { PrismaClient } from "@prisma/client";
const helsinkidb = new PrismaClient();

// get Authorizations
export const getAuthorizations = async ({
  research_id,
}: {
  research_id?: number;
}) => {
  try {
    const authorizations = await helsinkidb.authorizations.findFirst({
      where: { research_id },
    });
    return { data: authorizations };
  } catch (error) {
    return catchHandler(error, "DB", "get Authorizations");
  }
};
