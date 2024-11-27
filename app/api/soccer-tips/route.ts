import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

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
  const url = "https://soccertips.net/free-soccer-tips/";

  try {
    const browser = await puppeteer.launch({
      headless: true, // Ensure it runs in headless mode for server environments
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Required for running in environments like Vercel
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

      // Check if the "View More" button exists and click it
      const viewMoreButton = await page.$("button#view-more-button"); // Replace selector as needed
      if (viewMoreButton) {
        await viewMoreButton.click();
        await delay(2000); // Delay using the custom delay function
      } else {
        hasMorePages = false;
      }
    }

    await browser.close();

    // Return the scraped tips as JSON
    return NextResponse.json({ success: true, data: tips });
  } catch (error : any) {
    console.error("Error scraping soccer tips:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch soccer tips", error: error.message },
      { status: 500 }
    );
  }
}
