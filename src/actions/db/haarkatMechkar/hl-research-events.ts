"use server";
import * as db from "@/lib/db/haarkatMechkar/hl-research-events";
import { catchHandler } from "@/utils/catch-handlers";

export const addHlResearchEvents = async ({
  research_id,
  content,
  writer_id,
  event_date,
  writing_date,
  event_type_id,
  report_date,
  care_name_hl_id,
  care_type_id,
  close_date,
  event_status,
  version_list_id,
  remarks,
  before_confirm,
  is_ready,
  event_group_id,
  version_id,
  paid_up,
  chairman_decision,
  amount,
  message_id,
}: {
  research_id?: number;
  content?: string;
  writer_id?: number;
  event_date?: Date;
  writing_date?: Date;
  event_type_id?: number;
  report_date?: Date;
  care_name_hl_id?: number;
  care_type_id?: number;
  close_date?: Date;
  event_status?: number;
  version_list_id?: number;
  remarks?: string;
  before_confirm?: number;
  is_ready?: number;
  event_group_id?: number;
  version_id?: number;
  paid_up?: number;
  chairman_decision?: string;
  amount?: number;
  message_id?: string;
}) => {
  try {
    return await db.addHlResearchEvents({
      research_id,
  content,
  writer_id,
  event_date,
  writing_date,
  event_type_id,
  report_date,
  care_name_hl_id,
  care_type_id,
  close_date,
  event_status,
  version_list_id,
  remarks,
  before_confirm,
  is_ready,
  event_group_id,
  version_id,
  paid_up,
  chairman_decision,
  amount,
  message_id,
    });
  } catch (error: unknown) {
    return catchHandler(error, "action", "add hl research events");
  }
};
