import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { redisHelper } from "@/lib/redis"; // Ensure redisHelper is properly configured

export const dynamic = "force-dynamic";

type SoccerTip = {
  category: string; // "Best Football Tip for Today" or "Win Accumulator Tip for Today"
  league: string;
  time: string;
  match: string;
  tip: string;
  odd: string;
};

export async function GET() {
  const url = "https://www.safertip.com/"; // Replace with the actual URL
  const CACHE_KEY = "football-tips-cache";
  const CACHE_TTL = 60 * 60 * 24; // Cache duration: 24 hours (in seconds)

  try {
    // Check Redis cache
    const cachedData = await redisHelper.get<SoccerTip[]>(CACHE_KEY);
    if (cachedData) {
      console.log("Using cached data from Redis");
      return NextResponse.json({ success: true, data: cachedData });
    }

    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const tips: SoccerTip[] = [];

    // Scrape both tables
    $(".col-md-6").each((_index, section) => {
      const category = $(section).find("h2").text().trim();

      console.log("section", section)
      // Ensure the category is valid
      if (
        category === "Best Football Tip for Today" ||
        category === "Win Accumulator Tip for Today"
      ) {
        // Iterate through table rows
        $(section)
          .find("tbody")
          .each((_rowIndex, row) => {
            const league = $(row).find("td").eq(0).text().trim();
            const time = $(row).find("td").eq(1).text().trim();
            const match = $(row)
              .find("td")
              .eq(2)
              .text()
              .replace(/\s{2,}/g, " ") // Clean extra spaces
              .trim();
            const tip = $(row).find("td").eq(3).text().trim();
            const odd = parseFloat($(row).find("td").eq(4).text().trim())
              .toFixed(2)
              .toString();

            if (league && time && match && tip && odd) {
              tips.push({ category, league, time, match, tip, odd });
            }
          });
      }
    });

    console.log("Scraped Tips:", tips);

    // Cache the scraped data in Redis
    await redisHelper.set(CACHE_KEY, tips, CACHE_TTL);

    return NextResponse.json({ success: true, data: tips });
  } catch (error: unknown) {
    console.error("Error scraping football tips:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to scrape football tips",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
