import {
  Resolver,
  Mutation,
  Arg,
  Subscription,
  Root,
  PubSub,
  PubSubEngine,
} from "type-graphql";

import Argiope from "../Argiope";
import Report from "./report";

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
        async () => await pubSub.publish("CRAWLING_URL", url)
      );
      this.spider.on(
        "CRAWLED_URL",
        async () => await pubSub.publish("CRAWLED_URL", url)
      );
    }

    return `Crawling ${url}`;
  }

  @Subscription(() => Report, { topics: ["CRAWLING_URL", "CRAWLED_URL"] })
  crawlerReport(@Root() _url: string): Report {
    return {
      crawled: this.spider.crawledUrls,
      crawling: this.spider.crawlingUrls,
    };
  }
}

export default CrawlerResolver;
