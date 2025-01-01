"use server";

import { addMailer } from "@/actions/db/mailer/mailer";
import { getGeneralHlTable } from "@/actions/db/sendToProfesorAI/general-hl-table";
import { getOleTable } from "@/actions/db/sendToProfesorAI/ole-table";
import {
  getSendProfessorAI,
  updateSendToProfessorAI,
} from "@/actions/db/sendToProfesorAI/send-to-profesor-ai";
import { catchHandler } from "@/utils/catch-handlers";
import { NextResponse } from "next/server";
import { getHtmlBody } from "./attachment";

export async function POST() {
  const ProfesorAiBASE = process.env.PROFESORAI_BASEURL;
  const ProfesorAiApiENDPOINT =
    process.env.PROFESORAI_PRODIFY_HELSINKI_API_ENDPOINT;
  const UserID = process.env.USER_ID || "";
  const OrgID = process.env.ORG_ID || "";
  try {
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
    if (!sendToProf) {
      return NextResponse.json(
        { error: "Request body must be a non-empty array of profesor" },
        { status: 400 }
      );
    }
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
          number_id: number;
          research_id: number;
          f_name: string;
          file_description: string;
        } | null;
      };
      oleTable = resultOleTable?.data;
    } catch (error) {
      catchHandler(error, "API", "get Ole Table");
    }
    if (!oleTable) {
      return NextResponse.json(
        { error: "Request body must be a non-empty array of ole table" },
        { status: 400 }
      );
    }

    const { DataFile, number_id, research_id, f_name, file_description } =
      oleTable;

    //get General Hl Table
    let generalHl;
    try {
      const resultGeneralHl = (await getGeneralHlTable({ type_number })) as {
        data: { general_text: string } | null;
      };
      generalHl = resultGeneralHl?.data;
    } catch (error) {
      catchHandler(error, "API", "get General Hl Table");
    }
    if (!generalHl) {
      return NextResponse.json(
        { error: "Request body must be a non-empty array of general Hl table" },
        { status: 400 }
      );
    }
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
    if (!response) {
      return NextResponse.json(
        { error: "Request body must be a non-empty of fetching data" },
        { status: 400 }
      );
    }
    if (!response.ok) {
      console.log("!response.ok", await response.text());
      return NextResponse.json({ error: response.statusText }, { status: 400 });
    }
    const result = await response.text();
    const { analysis } = JSON.parse(result);
    console.log("result", JSON.stringify(result));
    try {
      await updateSendToProfessorAI(id, { analysis: JSON.stringify(analysis) });
    } catch (error) {
      catchHandler(error, "API", "update send to professor AI");
    }
    const html = JSON.parse(JSON.stringify(analysis));
    const body = getHtmlBody(html)
    
    try {
      await addMailer({
        subject: file_description,
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
    return new Response(
      JSON.stringify({
        message: "File received and processed successfully.",
      }),
      {
        status: 200,
      }
    );
    // return NextResponse.json({ message: "sent successfully" }, { status: 200 });
  } catch (error) {
    catchHandler(error, "API", "send data from AI");
    return NextResponse.json(
      { error: "Internal server error!!" },
      { status: 501 }
    );
  }
}
