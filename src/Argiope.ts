import got from "got";

import Scraper from "./Scraper";

interface SiteData {
  title?: string;
  error?: boolean;
  links?: Set<string>;
}

class Argiope {
  speed: number;
  baseUrl: string;
  scraper: Scraper;
  visited: Set<string>;
  sitemap: Map<string, SiteData>;

  constructor(url: string, speed: number = 1) {
    this.speed = speed;
    this.baseUrl = url;
    this.visited = new Set();
    this.sitemap = new Map();
    this.scraper = new Scraper();
  }

  async getData(url: string) {
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

  async crawl(url: string) {
    setTimeout(async () => {
      const data: SiteData = await this.getData(url);

      if (!data.error) {
        this.sitemap.set(url, data);

        for (let link of data.links) {
          if (!this.visited.has(link)) {
            this.visited.add(link);

            this.crawl(link);
          }
        }
      }
    }, 1000 / this.speed);
  }

  start() {
    this.crawl(this.baseUrl);
  }
}

export default Argiope;
