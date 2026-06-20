import { z } from "zod";

export const createOfferSchema = z.object({
  drive_id: z.string().uuid(),
  candidate_id: z.string().uuid(),
  offer_letter_number: z.string().min(1),

  gross_ctc: z.number(),
  net_ctc: z.number().optional(),

  fixed_component: z.number().optional(),
  variable_component: z.number().optional(),

  joining_date: z.string().optional(),

  offer_document_url: z.string().optional(),

  offer_status: z
    .enum([
      "DRAFT",
      "SENT",
      "ACCEPTED",
      "DECLINED",
      "REVOKED",
      "EXPIRED",
      "LAPSED",
    ])
    .optional(),
});
