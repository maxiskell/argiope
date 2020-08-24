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
      this.spider.on("CRAWLING_URL", async (url) => {
        await pubSub.publish("CRAWLING_URL", url);
      });
    }

    return `Crawling ${url}`;
  }

  @Subscription(() => String, { topics: "CRAWLING_URL" })
  currentUrl(@Root() siteName: string): string {
    return siteName;
  }
}

export default CrawlerResolver;
