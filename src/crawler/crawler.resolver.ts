import { Resolver, Mutation, Arg } from "type-graphql";

import Argiope from "../Argiope";

@Resolver(CrawlerResolver)
class CrawlerResolver {
  spider: Argiope;

  @Mutation(() => String)
  crawl(
    @Arg("url") url: string,
    @Arg("speed") speed: number,
    @Arg("maxCrawls") maxCrawls: number
  ): string {
    if (!this.spider) {
      this.spider = new Argiope(url, speed, maxCrawls);
      this.spider.start();
    }

    return `Crawling ${url}`;
  }
}

export default CrawlerResolver;
