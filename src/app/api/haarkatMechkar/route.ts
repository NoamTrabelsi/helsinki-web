"use server";

import { addHlResearchEvents } from "@/actions/db/haarkatMechkar/hl-research-events";
import { getResearchr } from "@/actions/db/haarkatMechkar/researchs";
import { catchHandler } from "@/utils/catch-handlers";
import { sleep } from "@/utils/sleep";

const interval = 10 * 60 * 1000; //10 דק

export async function POST() {
  // while (true) {
  let researchs;
  try {
    const answer = (await getResearchr()) as {
      data: {
        research_id: number;
      };
    };
    researchs = answer?.data;
    console.log(researchs);
  } catch (error) {
    catchHandler(error, "API", "get Researchr");
  }
  if (researchs) {
    try {
      await addHlResearchEvents({
        research_id: researchs?.research_id,
      });
    } catch (error) {}
  } else {
    await sleep(interval);
  }
  // }
}
