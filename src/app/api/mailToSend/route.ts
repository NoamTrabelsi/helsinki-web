"use server";

import { catchHandler } from "@/utils/catch-handlers";
import {
  getResearch,
  getResearcher,
} from "@/actions/db/mail-to-send/researchs";
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
import { createEmailBody } from "./body";

export async function POST() {
  const appType = "matarotHelsinki";
  while (true) {
    let mailToSend;
    try {
      const result = (await getMailToSend()) as {
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
      mailToSend = result?.data;
    } catch (error) {
      catchHandler(error, "mail to send - webhook", "get Mail To Send");
      return NextResponse.json(
        { message: "Failed to get mail to send" },
        { status: 500 }
      );
    }
    console.log("mailToSend",mailToSend);

    if (mailToSend) {
      const {
        id,
        mail_subject,
        mail_content,
        mail_address_to,
        mail_address_cc,
        mail_address_bcc,
        ole_table_id,
        ole_table_st,
        researcher,
        research_id,
        authorizations,
        mail_type,
        cyclic,
        site_id,
        mail_date,
      } = mailToSend;
      let mail = "";
      let mailTypeBCC = "";
      let attachments = "";
      if (ole_table_id && ole_table_st) {
        attachments = ole_table_id + "," + ole_table_st;
      } else if (ole_table_id) {
        attachments = "" + ole_table_id;
      } else {
        attachments = ole_table_st;
      }

      let research;
      try {
        const result = (await getResearch({
          research_id: research_id,
        })) as { data: { contact_hl_id: number; hl_request_number: number } };
        research = result.data;
      } catch (error) {
        catchHandler(error, "mail to send - webhook", "get Research");
      }
      if (!research) {
        return NextResponse.json({ message: "No research" }, { status: 500 });
      }
      if (researcher !== 0) {
        let principalResearcher;
        try {
          const result = (await getResearcher({
            contact_hl_id: research?.contact_hl_id,
          })) as { data: { email: string } | null };
          principalResearcher = result?.data;
          mail += principalResearcher?.email + ";";
        } catch (error) {
          catchHandler(
            error,
            "mail to send - webhook",
            "get Researchr contact"
          );
          return NextResponse.json(
            { message: "Failed to get Researchr" },
            { status: 500 }
          );
        }
      }
      if (authorizations !== 0) {
        let Authorization;
        try {
          const result = (await getAuthorizations({
            research_id: research_id,
          })) as { data: { email: string } | null };
          Authorization = result?.data;
          mail += Authorization?.email + ";";
        } catch (error) {
          catchHandler(
            error,
            "mail to send - webhook",
            "get Authorizations contact"
          );
          return NextResponse.json(
            { message: "Failed to get Authorizations" },
            { status: 500 }
          );
        }
      }
      if (mail_type >= 40 && mail_type <= 43) {
        let mailBCC;
        try {
          const result = (await getGlobalParamenters({
            tbl_link_id: 1000 + mail_type,
            site_id: site_id,
          })) as { data: { value_str: string } | null };
          mailBCC = result?.data;
          mailTypeBCC += mailBCC?.value_str;
        } catch (error) {
          catchHandler(
            error,
            "mail to send - webhook",
            "get Global Paramenters"
          );
          return NextResponse.json(
            { message: "Failed to get Global Paramenters" },
            { status: 500 }
          );
        }
      }
      try {
        await addMailerAddMailToSendArchive({
          subject: mail_subject,
          body: createEmailBody(mail_content),
          to: mail_address_to + (";" + mail || ""),
          cc: mail_address_cc,
          bcc: mail_address_bcc + (";" + mailTypeBCC || ""),
          attachments: attachments,
          appType: appType,
          mail_type: mail_type,
          research_id: research_id,
          mail_date: mail_date,
          ole_table_id: ole_table_id,
          site_id: site_id,
          ole_table_st: ole_table_st,
        });
        //delete mail from mail_to_send and
        if (cyclic === 0 || cyclic === null) {
          try {
            await deleteMailToSend(id);
          } catch (error) {
            catchHandler(
              error,
              "mail to send - webhook",
              "delete Mail To Send"
            );
            return NextResponse.json(
              { message: "Failed to delete Mail To Send" },
              { status: 500 }
            );
          }
        } else {
          //update mail in mail_to_send
          try {
            await updateMailToSend(id, {
              mail_date: new Date(
                new Date(mail_date).getTime() + cyclic * 1000 * 60 * 24 * 60
              ),
            });
          } catch (error) {
            catchHandler(
              error,
              "mail to send - webhook",
              "update Mail To Send"
            );
            return NextResponse.json(
              { message: "Failed to update Mail To Send" },
              { status: 500 }
            );
          }
        }
        await sleep(2000);
      } catch (error) {
        catchHandler(error, "mail to send - webhook", "add task to mailer");
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
