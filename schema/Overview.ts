import { z } from "zod";
import { differenceInDays } from "date-fns";
import { MAX_DATE_RANGE_DAYS } from "@/app/lib/contants/MAX_DATE_RANGE_DAYS";
export const OverviewQuerySchema = z
  .object({ from: z.coerce.date(), to: z.coerce.date() })
  .refine((args) => {
    const { from, to } = args;
    const days = differenceInDays(to, from);
    const isvalidRange = days >= 0 && days <= MAX_DATE_RANGE_DAYS;
    return isvalidRange;
  });
