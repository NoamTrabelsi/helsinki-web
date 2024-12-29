"use server";
import { catchHandler } from "@/utils/catch-handlers";
import { PrismaClient } from "@prisma/client";
const helsinkidb = new PrismaClient();

//add mail from mail to send to archive
export const addMailToSendArchive = async ({
  mail_subject,
  mail_content,
  mail_address_to,
  mail_address_cc,
  mail_address_bcc,
  mail_type,
  research_id,
  mail_date,
  ole_table_id,
  site_id,
  ole_table_st,
}: {
  mail_subject?: string;
  mail_content?: string;
  mail_address_to?: string;
  mail_address_cc?: string;
  mail_address_bcc?: string;
  mail_type?: number;
  research_id?: number;
  mail_date?: Date;
  ole_table_id?: number;
  site_id?: number;
  ole_table_st?: string;
}) => {
  try {
    return await helsinkidb.mail_to_send_archive.create({
      data: {
        mail_subject,
        mail_content,
        mail_address_to,
        mail_address_cc,
        mail_address_bcc,
        mail_type,
        research_id,
        mail_date,
        archive_time: new Date(),
        ole_table_id,
        site_id,
        ole_table_st,
      },
    });
  } catch (error) {
    return catchHandler(error, "DB", "add mail to send archive");
  }
};
