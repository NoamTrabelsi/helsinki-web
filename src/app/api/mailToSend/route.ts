"use server";

import { catchHandler } from "@/utils/catch-handlers";
import { getResearchr } from "@/actions/db/mail-to-send/researchs";
import {
  deleteMailToSend,
  getMailToSend,
  updateMailToSend,
} from "@/actions/db/mail-to-send/mail-to-send";
import { NextResponse } from "next/server";
import { getAuthorizations } from "@/actions/db/mail-to-send/authorizations";
import { getGlobalParamenters } from "@/actions/db/mail-to-send/global-paramenters";
import { sleep } from "@/utils/sleep";
import { addMailerAddMailToSendArchive } from "@/actions/db/global";

export async function POST() {
  const appType = "matarotHelsinki";
  while (true) {
    let task;
    try {
      const mailsToSend = (await getMailToSend()) as {
        data: {
          id: number;
          mail_subject: string;
          mail_content: string;
          mail_address_to: string;
          mail_address_cc: string;
          mail_address_bcc: string;
          ole_table_id: number;
          ole_table_st: string;
          researcher: number;
          research_id: number;
          authorizations: number;
          mail_type: number;
          cyclic: number;
          site_id: number;
          mail_date: Date;
        };
      };
      task = mailsToSend?.data;
    } catch (error) {
      catchHandler(error, "API", "get Mail To Send");
      return NextResponse.json(
        { message: "Failed to get mail to send" },
        { status: 500 }
      );
    }
    if (task) {
      let mail = "";
      let mailTypeBCC = "";
      let attachments = "";
      if (task.ole_table_id && task.ole_table_st) {
        attachments = task.ole_table_id + "," + task.ole_table_st;
      } else if (task.ole_table_id) {
        attachments = "" + task.ole_table_id;
      } else {
        attachments = task.ole_table_st;
      }

      if (task.researcher !== 0) {
        let research;
        try {
          const result = (await getResearchr({
            research_id: task.research_id,
          })) as { data: { email: string } | null };
          research = result?.data;
          mail += research?.email + ";";
        } catch (error) {
          catchHandler(error, "API", "get Researchr");
          return NextResponse.json(
            { message: "Failed to get Researchr" },
            { status: 500 }
          );
        }
      }
      if (task.authorizations !== 0) {
        let Authorization;
        try {
          const result = (await getAuthorizations({
            research_id: task.research_id,
          })) as { data: { email: string } | null };
          Authorization = result?.data;
          mail += Authorization?.email + ";";
        } catch (error) {
          catchHandler(error, "API", "get Authorizations");
          return NextResponse.json(
            { message: "Failed to get Authorizations" },
            { status: 500 }
          );
        }
      }
      if (task.mail_type >= 40 && task.mail_type <= 43) {
        let mailBCC;
        try {
          const result = (await getGlobalParamenters({
            tbl_link_id: 1000 + task.mail_type,
            site_id: task.site_id,
          })) as { data: { value_str: string } | null };
          mailBCC = result?.data;
          mailTypeBCC += mailBCC?.value_str;
        } catch (error) {
          catchHandler(error, "API", "get Global Paramenters");
          return NextResponse.json(
            { message: "Failed to get Global Paramenters" },
            { status: 500 }
          );
        }
      }
      try {
        await addMailerAddMailToSendArchive({
          subject: task.mail_subject,
          body: task.mail_content,
          to: task.mail_address_to + (";" + mail || ""),
          cc: task.mail_address_cc,
          bcc: task.mail_address_bcc + mailTypeBCC,
          attachments: attachments,
          appType: appType,
          mail_type: task.mail_type,
          research_id: task.research_id,
          mail_date: task.mail_date,
          ole_table_id: task.ole_table_id,
          site_id: task.site_id,
          ole_table_st: task.ole_table_st,
        });
        //delete mail from mail_to_send and
        if (task.cyclic === 0 || task.cyclic === null) {
          try {
            await deleteMailToSend(task.id);
          } catch (error) {
            catchHandler(error, "API", "delete Mail To Send");
            return NextResponse.json(
              { message: "Failed to delete Mail To Send" },
              { status: 500 }
            );
          }
        } else {
          //update mail in mail_to_send
          try {
            await updateMailToSend(task.id, {
              mail_date: new Date(
                new Date(task.mail_date).getTime() +
                  task.cyclic * 1000 * 60 * 24 * 60
              ),
            });
          } catch (error) {
            catchHandler(error, "API", "update Mail To Send");
            return NextResponse.json(
              { message: "Failed to update Mail To Send" },
              { status: 500 }
            );
          }
        }
        await sleep(2000);
      } catch (error) {
        catchHandler(error, "API", "add task to mailer");
        return NextResponse.json(
          { message: "Failed to add task to mailer and Mail To Send Archive" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json({ message: "sleep" }, { status: 200 });
    }
  }
}
