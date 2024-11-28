import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { redisHelper } from "@/lib/redis"; // Update path to your redisHelper

export const dynamic = "force-dynamic";

export async function GET() {
  const url = "https://www.vitibet.com/index.php?clanek=quicktips&sekce=fotbal&lang=en";
  const CACHE_KEY = "vitebet_cache";
  const CACHE_TTL = 60 * 60 * 24; // Cache duration: 24 hours

  try {
    // Check if data is available in Redis cache
    const cachedTips = await redisHelper.get<any[]>(CACHE_KEY);
    if (cachedTips) {
      console.log("Using cached data from Redis");
      return NextResponse.json({ success: true, data: cachedTips });
    }


    // Fetch the HTML content of the page
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const tips: any[] = [];
    let currentLeague = "";

    // Parse the HTML using Cheerio
    $("table#example tbody tr").each((_index, row) => {
      const leagueRow = $(row).find("td[colspan='13'], td[colspan='14']");
      if (leagueRow.length > 0) {
        // Update current league when a league header row is found
        currentLeague = leagueRow.text().trim();
        return;
      }

      const cells = $(row).find("td");
      if (cells.length > 0) {
        const date = cells.eq(0).text().trim();
        const homeTeam = cells.eq(2).text().trim();
        const awayTeam = cells.eq(3).text().trim();
        const homeScore = cells.eq(5).text().trim();
        const awayScore = cells.eq(7).text().trim();
        const confidence = cells.eq(8).text().trim();
        const tip = cells.eq(11).text().trim();

        if (date && homeTeam && awayTeam && tip) {
          tips.push({
            league: currentLeague,
            date,
            match: `${homeTeam} vs ${awayTeam}`,
            score: `${homeScore} : ${awayScore}`,
            tip,
            confidence,
          });
        }
      }
    });

    // Store the scraped data in Redis cache
    await redisHelper.set(CACHE_KEY, tips, CACHE_TTL);

    return NextResponse.json({ success: true, data: tips });
  } catch (error: unknown) {
    console.error("Error scraping tips:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to scrape tips",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
