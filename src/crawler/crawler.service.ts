import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class CrawlerService {
  async searchForKeywords(
    url: string = 'https://searxng.site/searxng/search',
    keywords: string[],
  ): Promise<string[]> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Search for each keyword on the page and collect results
    const results = await Promise.all(
      keywords.map(async (keyword) => {
        const keywordFound = await page.evaluate((keyword) => {
          return document.body.textContent.includes(keyword);
        }, keyword);

        return keywordFound
          ? `Keyword "${keyword}" found.`
          : `Keyword "${keyword}" not found.`;
      }),
    );

    await browser.close();
    return results;
  }
}
