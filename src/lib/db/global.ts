"use server";
import { catchHandler } from "@/utils/catch-handlers";
import { PrismaClient } from "@prisma/client";
const helsinkidb = new PrismaClient();

// get Contact Add Mailer Update Task
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
  await helsinkidb.$transaction(async (prisma) => {
    try {
      const event = await prisma.hl_research_events.create({
        data: {
          research_id,
          content,
          writer_id,
          report_date,
          event_date: new Date(),
          writing_date: new Date(),
          event_type_id: 12,
          care_type_id: 0,
          event_status: 1,
          before_confirm: 0,
          is_ready: 0,
        },
      });
      await prisma.f_12.create({
        data: {
          research_id,
          research_event_id: event.hl_research_event_id,
          request_date: new Date(),
          validity_date,
          contact_hl_id,
        },
      });
      await helsinkidb.hl_logs.create({
        data: {
          module_type: 7,
          module_number,
          contact_id,
          log_DateTime: new Date(),
          new_value2: "ארוע נפתח אוטומטית מ - PM7",
          ctrl_name: "ארוע נפתח אוטומטית מ - PM7",
        },
      });
    } catch (error) {
      catchHandler(error, "webhook - haarkatMechkar", "transaction error");
    }
  });
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
  await helsinkidb.$transaction(async (prisma) => {
    try {
      await prisma.mailer.create({
        data: {
          createdAt: new Date(),
          updatedAt: new Date(),
          subject: subject,
          body: body,
          to: to,
          cc: cc,
          bcc: bcc,
          sendDate: mail_date,
          attachments: attachments,
          status: 1,
          appType: appType,
          appId: appId,
        },
      });
      await helsinkidb.mail_to_send_archive.create({
        data: {
          mail_subject:subject,
          mail_content:body,
          mail_address_to:to,
          mail_address_cc:cc,
          mail_address_bcc:bcc,
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
      catchHandler(error, "webhook - haarkatMechkar", "transaction error");
    }
  });
};
