import {
  Resolver,
  Mutation,
  Arg,
  Subscription,
  Root,
  PubSub,
  PubSubEngine,
  Query,
} from "type-graphql";

import Argiope from "../argiope/Argiope";
import Report from "./report";
import Crawl from "./crawl";
import SiteMap from "./sitemap";

@Resolver(CrawlerResolver)
class CrawlerResolver {
  spider: Argiope;

  @Mutation(() => String)
  crawl(
    @Arg("url") url: string,
    @Arg("speed") speed: number,
    @Arg("maxCrawls") maxCrawls: number,
    @PubSub() pubSub: PubSubEngine
  ): string {
    if (!this.spider) {
      this.spider = new Argiope(url, speed, maxCrawls);
      this.spider.start();

      this.spider.on(
        "CRAWLING_URL",
        async (url) => await pubSub.publish("CRAWLING_URL", url)
      );
      this.spider.on(
        "CRAWLED_URL",
        async (url) => await pubSub.publish("CRAWLED_URL", url)
      );
    }

    return `Crawling ${url} at ${speed} crawls per second (max: ${maxCrawls} crawls)`;
  }

  @Subscription(() => Report, { topics: ["CRAWLING_URL", "CRAWLED_URL"] })
  crawlerReport(@Root() _url: string): Report {
    return {
      crawled: this.spider.crawledUrls,
      crawling: this.spider.crawlingUrls,
    };
  }

  @Query(() => Crawl)
  sitemap(): Crawl {
    if (!this.spider) {
      return { baseUrl: "" };
    }

    const sitemaps = new Set() as Set<SiteMap>;

    for (let [url, { title, links }] of this.spider.sitemap) {
      sitemaps.add({
        url,
        title,
        links,
      });
    }

    return {
      baseUrl: this.spider.baseUrl,
      sitemaps,
    };
  }
}

export default CrawlerResolver;
