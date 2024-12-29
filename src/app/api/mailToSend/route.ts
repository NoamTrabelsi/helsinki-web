"use server";

import { catchHandler } from "@/utils/catch-handlers";
import { NextResponse } from "next/server";
import { getResearchr } from "@/actions/db/researchs";
import {
  deleteMailToSend,
  getMailToSend,
  updateMailToSend,
} from "@/actions/db/mail-to-send";
import { addMailer } from "@/actions/db/mailer";
import { getAuthorizations } from "@/actions/db/authorizations";
import { getGlobalParamenters } from "@/actions/db/global-paramenters";
import { addMailToSendArchive } from "@/actions/db/mail-to-send-archive";

export async function POST() {
  const appType = "matarotHelsinki";
  try {
    const mailsToSend = await getMailToSend({});
    const tasks = mailsToSend?.data;
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json(
        { error: "Request body must be a non-empty array of tasks" },
        { status: 400 }
      );
    }
    await Promise.all(
      tasks.map(async (task) => {
        let mail = "";
        let mailTypeBCC = "";
        const attachments = task.ole_table_id + "," + task.ole_table_st;
        if (task.researcher !== 0) {
          const result = (await getResearchr({
            research_id: task.research_id,
          })) as { data: { email: string } | null };
          const research = result?.data;
          if (research === null) {
            console.log("There is no Researcher");
          } else {
            mail += research?.email + ";";
          }
        }
        if (task.authorizations !== 0) {
          const result = (await getAuthorizations({
            research_id: task.research_id,
          })) as { data: { email: string } | null };
          const Authorization = result?.data;
          if (Authorization === null) {
            console.log("There is no Authorization");
          } else {
            mail += Authorization?.email + ";";
          }
        }
        if (task.mail_type >= 40 && task.mail_type <= 43) {
          const result = (await getGlobalParamenters({
            tbl_link_id: 1000 + task.mail_type,
            site_id: task.site_id,
          })) as { data: { value_str: string } | null };
          const mailBCC = result?.data;
          if (mailBCC === null) {
            console.log("There is no Global Paramenters");
          } else {
            mailTypeBCC += mailBCC?.value_str;
          }
        }
        try {
          if (!mail) {
            await addMailer({
              subject: task.mail_subject,
              body: task.mail_content,
              to: task.mail_address_to,
              cc: task.mail_address_cc,
              bcc: task.mail_address_bcc + mailTypeBCC,
              attachments: attachments,
              appType: appType,
            });
          } else {
            await addMailer({
              subject: task.mail_subject,
              body: task.mail_content,
              to: task.mail_address_to + mail,
              cc: task.mail_address_cc,
              bcc: task.mail_address_bcc + mailTypeBCC,
              attachments: attachments,
              appType: appType,
            });
          }

          if (task.cyclic === 0 || task.cyclic === null) {
            //delete mail from mail_to_send and add mail to archive
            try {
              await addMailToSendArchive({
                mail_subject: task.mail_subject,
                mail_content: task.mail_content,
                mail_address_to: task.mail_address_to,
                mail_address_cc: task.mail_address_cc,
                mail_address_bcc: task.mail_address_bcc,
                mail_type: task.mail_type,
                research_id: task.research_id,
                mail_date: task.mail_date,
                ole_table_id: task.ole_table_id,
                site_id: task.site_id,
                ole_table_st: task.ole_table_st,
              });
              await deleteMailToSend(task.id);
            } catch (error) {
              catchHandler(
                error,
                "API",
                "add task to mailer Archive and delete Mail To Send"
              );
            }
          } else {
            //update mail in mail_to_send and add mail to archive
            try {
              await addMailToSendArchive({
                mail_subject: task.mail_subject,
                mail_content: task.mail_content,
                mail_address_to: task.mail_address_to,
                mail_address_cc: task.mail_address_cc,
                mail_address_bcc: task.mail_address_bcc,
                mail_type: task.mail_type,
                research_id: task.research_id,
                mail_date: task.mail_date,
                ole_table_id: task.ole_table_id,
                site_id: task.site_id,
                ole_table_st: task.ole_table_st,
              });
              await updateMailToSend(task.id, {
                mail_date: new Date(
                  new Date(task.mail_date).getTime() +
                    task.cyclic * 1000 * 60 * 24 * 60
                ),
              });
            } catch (error) {
              catchHandler(
                error,
                "API",
                "add task to mailer Archive and update Mail To Send"
              );
            }
          }
        } catch (error) {
          catchHandler(error, "API", "add task to mailer");
        }
      })
    );
    return NextResponse.json(
      {
        message: `Emails sent successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    catchHandler(error, "API", "send tasks");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
