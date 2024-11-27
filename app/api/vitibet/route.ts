import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
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

    console.log("Scraping data from the website");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Scrape the data from the table
    const tips = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll("table#example tbody tr"));
      const tips: any[] = [];

      let currentLeague = "";
      rows.forEach((row) => {
        const leagueRow = row.querySelector("td[colspan='13'], td[colspan='14']");
        if (leagueRow) {
          // Update current league when a league header row is found
          currentLeague = (leagueRow as HTMLElement).innerText.trim();
          return;
        }

        const cells = row.querySelectorAll("td");
        if (cells.length > 0) {
          const date = (cells[0] as HTMLElement)?.innerText.trim();
          const homeTeam = (cells[2] as HTMLElement)?.innerText.trim();
          const awayTeam = (cells[3] as HTMLElement)?.innerText.trim();
          const homeScore = (cells[5] as HTMLElement)?.innerText.trim();
          const awayScore = (cells[7] as HTMLElement)?.innerText.trim();
          const tip = (cells[11] as HTMLElement)?.innerText.trim();
          const confidence = (cells[8] as HTMLElement)?.innerText.trim();

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

      return tips;
    });

    await browser.close();

    // Store the scraped data in Redis cache
    await redisHelper.set(CACHE_KEY, tips, CACHE_TTL);

    return NextResponse.json({ success: true, data: tips });
  } catch (error: any) {
    console.error("Error scraping tips:", error);
    return NextResponse.json(
      { success: false, message: "Failed to scrape tips", error: error.message },
      { status: 500 }
    );
  }
}
