"use server";

import { getContact } from "@/actions/db/haarkatMechkar/contact";
import { getHlEventTypes } from "@/actions/db/haarkatMechkar/hl-event-types";
import { getHlResearchEvents } from "@/actions/db/haarkatMechkar/hl-research-events";
import { getResearchr } from "@/actions/db/haarkatMechkar/researchs";
import { addHlResearchEventsAddF12AddHlLogs } from "@/actions/db/global";
import { catchHandler } from "@/utils/catch-handlers";
import { sleep } from "@/utils/sleep";

const interval = 10 * 60 * 1000; //10 דק

export async function POST() {
  while (true) {
    let researchs;
    let writer;
    let content;
    try {
      const answer = (await getResearchr()) as {
        data: {
          research_id: number;
          contact_hl_id: number;
          end_date: Date;
        };
      };
      researchs = answer?.data;
      const asResearch = await getHlResearchEvents({
        research_id: researchs.research_id,
      });
      if (asResearch) {
        continue;
      }
    } catch (error) {
      catchHandler(error, "webhook - haarkatMechkar", "get Researchr");
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
    if (researchs && content && writer) {
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
    } else {
      await sleep(interval);
    }
  }
}

// const event = (await addHlResearchEvents({
//   research_id: researchs.research_id,
//   content: content.event_type,
//   writer_id: writer.contact_id,
//   report_date: researchs.end_date,
// })) as { data: { hl_research_event_id: number } };
// try {
//   await addF12({
//     research_id: researchs.research_id,
//     research_event_id: event.data.hl_research_event_id,
//     validity_date: researchs.end_date,
//     contact_hl_id: researchs.contact_hl_id,
//   });
//   try {
//     await addHlLogs({
//       module_number: researchs.research_id,
//       contact_id: researchs.contact_hl_id,
//     });
//   } catch (error) {
//     catchHandler(error, "webhook - haarkatMechkar", "add Hl Logs");
//   }
// } catch (error) {
//   catchHandler(error, "webhook - haarkatMechkar", "add F_12");
// }
