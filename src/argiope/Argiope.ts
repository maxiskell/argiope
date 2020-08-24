import { EventEmitter } from "events";
import got from "got";

import Scraper from "./Scraper";

export interface ISiteData {
  title?: string;
  error?: boolean;
  links?: Set<string>;
}

class Argiope extends EventEmitter {
  speed: number;
  baseUrl: string;
  currentUrl: string;

  maxCrawls: number;
  crawledUrls: number;

  scraper: Scraper;
  visited: Set<string>;
  crawlingUrls: Set<string>;
  sitemap: Map<string, ISiteData>;

  constructor(url: string, speed: number = 1, maxCrawls: number = 1) {
    super();
    this.speed = speed;
    this.baseUrl = url;
    this.crawledUrls = 0;
    this.maxCrawls = maxCrawls;

    this.visited = new Set();
    this.sitemap = new Map();
    this.crawlingUrls = new Set();
    this.scraper = new Scraper();
  }

  /**
   * Visit a given URL an scrapes its title and relative links.
   *
   * @param url
   */
  async getData(url: string): Promise<ISiteData> {
    try {
      const { body } = await got(url);

      this.scraper.setDocument(body);

      const title = this.scraper.extractTitle();
      const links = this.scraper.extractRelativeLinks(url);

      return { title, links };
    } catch (err) {
      return { error: true };
    }
  }

  /**
   * Recursively crawl a given URL
   * as long as the crawling limit has not been exceeded.
   *
   * @param url string
   */
  async crawl(url: string) {
    setTimeout(async () => {
      this.crawlingUrls.add(url);
      this.emit("CRAWLING_URL", url);

      const data: ISiteData = await this.getData(url);

      if (!data.error) {
        this.sitemap.set(url, data);

        for (let link of data.links) {
          if (!this.visited.has(link) && this.visited.size < this.maxCrawls) {
            this.visited.add(link);

            this.crawl(link);
          }
        }

        this.crawlingUrls.delete(url);
        this.crawledUrls++;
        this.emit("CRAWLED_URL", url);
      }
    }, 1000 / this.speed);
  }

  /**
   * Start the crawler.
   */
  start() {
    this.crawl(this.baseUrl);
  }
}

export default Argiope;
