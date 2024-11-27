import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = "https://www.vitibet.com/index.php?clanek=quicktips&sekce=fotbal&lang=en"; 

  try {
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

    return NextResponse.json({ success: true, data: tips });
  } catch (error: any) {
    console.error("Error scraping tips:", error);
    return NextResponse.json(
      { success: false, message: "Failed to scrape tips", error: error.message },
      { status: 500 }
    );
  }
}
