import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { redisHelper } from "@/lib/redis";

export const dynamic = "force-dynamic";

type Tip = {
  time: string;
  date: string;
  league: string;
  match: string;
  tip: string;
  odds: string;
  tipster: string;
  result: string;
};

export async function GET() {
  const CACHE_KEY = "soccer_tips";
  const CACHE_TTL = 60 * 60 * 24; // Cache duration: 24 hours

  try {
    // Check if data exists in Redis cache
    const cachedData = await redisHelper.get<Tip[]>(CACHE_KEY);
    if (cachedData) {
      console.log("Returning cached data");
      return NextResponse.json({ success: true, data: cachedData });
    }

    const url = "https://soccertips.net/free-soccer-tips/";

    // Fetch the HTML content of the page
    const response = await axios.get(url);
    const html = response.data;

    // Load HTML into Cheerio
    const $ = cheerio.load(html);

    const tips: Tip[] = [];

    // Parse the HTML using Cheerio
    $(".free-tips tr").each((_index, row) => {
      const time = $(row).find("td[id='time'] .date_time span.time").text().trim() || "";
      const date = $(row).find("td[id='time'] .date_time span.date").text().trim() || "";
      const league = $(row).find("td[id='league'] .league").text().trim() || "";
      const match = $(row).find("td[id='match'] .match").text().trim() || "";
      const tip = $(row).find("td[id='tips_data'] .tips").text().trim() || "";
      const odds = $(row).find("td[id='odds'] .odds").text().trim() || "";
      const tipster = $(row).find("td[id='source_tips'] a").text().trim() || "";
      const result = $(row).find("td[id='result'] .match_result").text().trim() || "";

      if (time && date && match && tip) {
        tips.push({ time, date, league, match, tip, odds, tipster, result });
      }
    });

    // Store the scraped data in Redis cache
    await redisHelper.set(CACHE_KEY, tips, CACHE_TTL);

    return NextResponse.json({ success: true, data: tips });
  } catch (error: unknown) {
    console.error("Error scraping soccer tips:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch soccer tips",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
