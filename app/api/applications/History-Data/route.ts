import { NextResponse } from "next/server";
import prisma from "@/app/lib/client";
import { Period, Timeframe } from "@/app/lib/contants/HistoryType";
import { getDaysInMonth } from "date-fns";
import { z } from "zod";

const getHistoryDateSchema = z.object({
  timeframe: z.enum(["month", "year"]),
  year: z.coerce.number().min(2000),
  month: z.coerce.number().min(0).max(11),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe");
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    const queryParams = getHistoryDateSchema.safeParse({
      timeframe,
      year,
      month,
    });

    if (!queryParams.success) {
      return NextResponse.json(
        { error: queryParams.error.message },
        { status: 400 }
      );
    }

    const data = await getHistoryData(queryParams.data.timeframe, {
      month: queryParams.data.month,
      year: queryParams.data.year,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching history data:", error);
    return NextResponse.json(
      { message: "Internal server error"},
      { status: 500 }
    );
  }
}

async function getHistoryData(timeframe: Timeframe, period: Period) {
  switch (timeframe) {
    case "year":
      return await getYearHistoryData(period.year);
    case "month":
      return await getMonthHistoryData(period.year, period.month);
    default:
      throw new Error("Invalid timeframe");
  }
}

type HistoryData = {
  Accepted: number;
  Rejected: number;
  year: number;
  month: number;
  day?: number;
};

async function getYearHistoryData(year: number) {
  const result = await prisma.yearlyHistory.groupBy({
    by: ["month"],
    where: { year },
    _sum: {
      Accepted: true,
      Rejected: true,
    },
    orderBy: [{ month: "asc" }],
  });

  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];
  for (let i = 0; i < 12; i++) {
    let Accepted = 0;
    let Rejected = 0;
    const month = result.find((row) => row.month === i);
    if (month) {
      Accepted = month._sum.Accepted || 0;
      Rejected = month._sum.Rejected || 0;
    }
    history.push({
      year,
      month: i,
      Accepted,
      Rejected,
    });
  }
  return history;
}

async function getMonthHistoryData(year: number, month: number) {
  const result = await prisma.monthlyHistory.groupBy({
    by: ["day"],
    where: { month, year },
    _sum: {
      Accepted: true,
      Rejected: true,
    },
    orderBy: [{ day: "asc" }],
  });

  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];
  const daysInMonth = getDaysInMonth(new Date(year, month));
  for (let j = 0; j < daysInMonth; j++) {
    let Accepted = 0;
    let Rejected = 0;
    const day = result.find((d) => d.day === j);
    if (day) {
      Accepted = day._sum.Accepted || 0;
      Rejected = day._sum.Rejected || 0;
    }
    history.push({
      year,
      month,
      day: j,
      Accepted,
      Rejected,
    });
  }
  return history;
}
