"use server";
import * as db from "@/lib/db/global";
import { catchHandler } from "@/utils/catch-handlers";

export const addHlResearchEventsAddF12AddHlLogs = async ({
  research_id,
  content,
  writer_id,
  report_date,
  validity_date,
  contact_hl_id,
  module_number,
  contact_id,
}: {
  research_id?: number;
  content?: string;
  writer_id?: number;
  report_date?: Date;
  validity_date?: Date;
  contact_hl_id?: number;
  module_number?: number;
  contact_id?: number;
}) => {
  try {
    return await db.addHlResearchEventsAddF12AddHlLogs({
      research_id,
      content,
      writer_id,
      report_date,
      validity_date,
      contact_hl_id,
      module_number,
      contact_id,
    });
  } catch (error: unknown) {
    return catchHandler(error, "action", "transaction error");
  }
};

export const addMailerAddMailToSendArchive = async ({
  subject,
  body,
  to,
  cc,
  bcc,
  attachments,
  appType,
  appId,
  mail_type,
  research_id,
  mail_date,
  ole_table_id,
  site_id,
  ole_table_st,
}: {
  subject: string;
  body: string;
  to: string;
  cc?: string;
  bcc?: string;
  attachments?: string;
  appType: string;
  appId?: string;
  mail_type?: number;
  research_id?: number;
  mail_date: Date;
  ole_table_id?: number;
  site_id?: number;
  ole_table_st?: string;
}) => {
  try {
    return await db.addMailerAddMailToSendArchive({
      subject,
      body,
      to,
      cc,
      bcc,
      attachments,
      appType,
      appId,
      mail_type,
      research_id,
      mail_date,
      ole_table_id,
      site_id,
      ole_table_st,
    });
  } catch (error: unknown) {
    return catchHandler(error, "action", "transaction error");
  }
};
