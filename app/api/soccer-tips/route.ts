import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET() {
  const CACHE_KEY = "soccer_tips";
  const CACHE_TTL = 60 * 60 * 24; // 24 hours

  try {
    // Check if cached data exists
    const cachedData = await redisHelper.get<Tip[]>(CACHE_KEY);
    if (cachedData) {
      console.log("Returning cached data");
      return NextResponse.json({ success: true, data: cachedData });
    }

    const url = "https://soccertips.net/free-soccer-tips/";
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    let tips: Tip[] = [];

    const scrapePage = async () => {
      return await page.evaluate(() => {
        const rows = document.querySelectorAll(".free-tips tr");
        const extractedTips: Tip[] = [];

        rows.forEach((row) => {
          const time = row.querySelector("td[id='time'] .date_time span.time")?.textContent?.trim() || "";
          const date = row.querySelector("td[id='time'] .date_time span.date")?.textContent?.trim() || "";
          const league = row.querySelector("td[id='league'] .league")?.textContent?.trim() || "";
          const match = row.querySelector("td[id='match'] .match")?.textContent?.trim() || "";
          const tip = row.querySelector("td[id='tips_data'] .tips")?.textContent?.trim() || "";
          const odds = row.querySelector("td[id='odds'] .odds")?.textContent?.trim() || "";
          const tipster = row.querySelector("td[id='source_tips'] a")?.textContent?.trim() || "";
          const result = row.querySelector("td[id='result'] .match_result")?.textContent?.trim() || "";

          if (time && date && match && tip) {
            extractedTips.push({ time, date, league, match, tip, odds, tipster, result });
          }
        });

        return extractedTips;
      });
    };

    let hasMorePages = true;

    while (hasMorePages) {
      const pageTips = await scrapePage();
      tips = [...tips, ...pageTips];
      const viewMoreButton = await page.$("button#view-more-button");
      if (viewMoreButton) {
        await viewMoreButton.click();
        await delay(2000);
      } else {
        hasMorePages = false;
      }
    }

    await browser.close();

    // Cache the scraped data
    await redisHelper.set(CACHE_KEY, tips, CACHE_TTL);

    return NextResponse.json({ success: true, data: tips });
  } catch (error: any) {
    console.error("Error scraping soccer tips:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch soccer tips", error: error.message },
      { status: 500 }
    );
  }
}
