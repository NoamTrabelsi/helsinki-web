"use server";

import { getContact } from "@/actions/db/haarkatMechkar/contact";
import { getHlEventTypes } from "@/actions/db/haarkatMechkar/hl-event-types";
import { getHlResearchEvents } from "@/actions/db/haarkatMechkar/hl-research-events";
import { getResearchr } from "@/actions/db/haarkatMechkar/researchs";
import { addHlResearchEventsAddF12AddHlLogs } from "@/actions/db/global";
import { catchHandler } from "@/utils/catch-handlers";
import { sleep } from "@/utils/sleep";
import { NextResponse } from "next/server";

export async function POST() {
  const excluded_ids: number[] = [];

  while (true) {
    let researchs;
    let writer;
    let content;
    const todayPlus91 = new Date();
    todayPlus91.setDate(todayPlus91.getDate() + 91);
    try {
      const answer = (await getResearchr({
        todayPlus91,
        excluded_ids: excluded_ids,
      })) as {
        data: {
          research_id: number;
          contact_hl_id: number;
          end_date: Date;
        };
      };
      researchs = answer?.data;
      console.log(researchs);
    } catch (error) {
      catchHandler(error, "webhook - haarkatMechkar", "get Researchr");
    }
    if (researchs) {
      try {
        const asResearch = (await getHlResearchEvents({
          research_id: researchs.research_id,
          todayPlus91: todayPlus91,
        })) as {
          data: {
            hl_research_event_id: number;
          };
        };
        if (asResearch.data?.hl_research_event_id) {
          // return NextResponse.json({ message: "there is id" }, { status: 200 });
          excluded_ids.push(researchs.research_id);
          continue;
        }
      } catch (error) {
        catchHandler(
          error,
          "webhook - haarkatMechkar",
          "get Hl Research Events"
        );
      }
      try {
        const answer = (await getContact({
          contact_hl_id: researchs?.contact_hl_id,
        })) as {
          data: {
            contact_id: number;
          };
        };
        writer = answer?.data;
      } catch (error) {
        catchHandler(
          error,
          "webhook - haarkatMechkar",
          "get contact id to writer"
        );
      }
      try {
        const answer = (await getHlEventTypes({
          hl_event_type_id: 12,
        })) as {
          data: {
            event_type: string;
          };
        };
        content = answer?.data;
      } catch (error) {
        catchHandler(error, "webhook - haarkatMechkar", "get Hl Event Types");
      }
      if (content && writer) {
        try {
          await addHlResearchEventsAddF12AddHlLogs({
            research_id: researchs.research_id,
            content: content.event_type,
            writer_id: writer.contact_id,
            report_date: researchs.end_date,
            validity_date: researchs.end_date,
            contact_hl_id: researchs.contact_hl_id,
            module_number: researchs.research_id,
            contact_id: researchs.contact_hl_id,
          });
        } catch (error) {
          catchHandler(error, "webhook - haarkatMechkar", "transaction");
        }
        await sleep(2000);
      }
    } else {
      return NextResponse.json({ message: "sleep" }, { status: 200 });
    }
  }
}
