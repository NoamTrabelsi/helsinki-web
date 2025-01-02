"use server";

import { addMailer } from "@/actions/db/mailer/mailer";
import { getGeneralHlTable } from "@/actions/db/sendToProfessorAI/general-hl-table";
import { getOleTable } from "@/actions/db/sendToProfessorAI/ole-table";
import {
  getSendProfessorAI,
  updateSendToProfessorAI,
} from "@/actions/db/sendToProfessorAI/send-to-professor-ai";
import { catchHandler } from "@/utils/catch-handlers";
import { getHtmlBody } from "./attachment";
import { sleep } from "@/utils/sleep";

const interval = 10 * 60 * 1000; //10 דק
const ProfesorAiBASE = process.env.PROFESORAI_BASEURL;
const ProfesorAiApiENDPOINT =
  process.env.PROFESORAI_PRODIFY_HELSINKI_API_ENDPOINT;
const UserID = process.env.USER_ID || "";
const OrgID = process.env.ORG_ID || "";

export async function POST() {
  while (true) {
    //get all Events that will pass to the professor when send_date != null
    let sendToProf;
    try {
      const answer = (await getSendProfessorAI({})) as {
        data: {
          id: number;
          ole_table_id: number;
          mail_address_to: string;
          mail_address_cc: string;
          mail_address_bcc: string;
          type_number: number;
        } | null;
      };
      sendToProf = answer?.data;
    } catch (error) {
      catchHandler(error, "API", "get sen to profesor AI");
    }
    if (sendToProf) {
      const {
        id,
        mail_address_to,
        mail_address_cc,
        mail_address_bcc,
        ole_table_id,
        type_number,
      } = sendToProf;
      //getOleTable
      let oleTable;
      try {
        const resultOleTable = (await getOleTable({ id: ole_table_id })) as {
          data: {
            DataFile: Buffer;
            research_id: number;
            f_name: string;
            file_description: string;
          } | null;
        };
        oleTable = resultOleTable?.data;
      } catch (error) {
        catchHandler(error, "API", "get Ole Table");
      }
      if (oleTable) {
        const { DataFile, research_id, f_name } = oleTable; //file_description
        //get General Hl Table
        let generalHl;
        try {
          const resultGeneralHl = (await getGeneralHlTable({
            type_number,
          })) as {
            data: { general_text: string } | null;
          };
          generalHl = resultGeneralHl?.data;
        } catch (error) {
          catchHandler(error, "API", "get General Hl Table");
        }
        if (generalHl) {
          const { general_text } = generalHl;
          //send to AI with formData
          const buffer = Buffer.from(DataFile);
          const base64String = buffer.toString("base64");
          const formData = new FormData();
          formData.append("userId", UserID);
          formData.append("orgId", OrgID);
          formData.append("file", base64String);
          formData.append("id", ole_table_id.toString());
          formData.append("researchId", research_id.toString());
          formData.append("eventType", type_number.toString());
          formData.append("eventName", general_text);
          formData.append("title", `דיווח בטיחות מספר:X.ארוע מספר:Y`); //file_description
          formData.append("subtitle", `מחקר מספר:${research_id.toString()}`);
          formData.append("link", " ");
          formData.append("fileName", f_name);

          const url = `${ProfesorAiBASE}/${ProfesorAiApiENDPOINT}`;

          const options = {
            method: "POST",
            body: formData,
          };

          let response;
          try {
            response = await fetch(url, options);
          } catch (error) {
            catchHandler(error, "API", "fetch data from AI");
          }
          if (response?.ok) {
            const result = await response.text();
            const { analysis } = JSON.parse(result);
            try {
              await updateSendToProfessorAI(id, {
                analysis: JSON.stringify(analysis),
                status: 2,
                errCode: 200,
                errMsg: "הצלחה",
              });
            } catch (error) {
              catchHandler(error, "API", "update send to professor AI");
            }
            const html = JSON.parse(JSON.stringify(analysis));
            const body = getHtmlBody(html);

            try {
              await addMailer({
                subject: `דיווח בטיחות מספר:X.ארוע מספר:Y`,
                body: (await body).toString(),
                to: mail_address_to,
                cc: mail_address_cc,
                bcc: mail_address_bcc,
                attachments: ole_table_id.toString(),
                appType: "matarotHelsinki",
              });
            } catch (error) {
              catchHandler(error, "API", "add professor AI to Mailer");
            }
            await sleep(3000);
          } else if (!response) {
            catchHandler(
              "Request body must be a non-empty of fetching data",
              "API",
              "get response"
            );
            continue;
          }
          if (!response.ok) {
            const result = await response.text();
            try {
              await updateSendToProfessorAI(id, {
                status: 2,
                errCode: response.status,
                errMsg: response.statusText,
              });
            } catch (error) {
              catchHandler(error, "API", "update send to professor AI");
            }
            catchHandler(
              result,
              "API",
              "get response"
            );
            continue;
          }
        } else {
          catchHandler(
            "Request body must be a non-empty array of general Hl table",
            "API",
            "get General Hl Table"
          );
        }
      } else {
        catchHandler(
          "Request body must be a non-empty array of ole table",
          "API",
          "get Ole Table"
        );
      }
    } else {
      await sleep(interval);
    }
  }
}
