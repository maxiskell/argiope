import "reflect-metadata";

import Argiope from "../argiope/Argiope";
import CrawlerResolver from "./crawler.resolver";

jest.spyOn(Argiope.prototype, "start").mockImplementation(() => null);

describe("CrawlerResolver", () => {
  describe("Query sitemap", () => {
    it("resolves initial state", () => {
      const resolver = new CrawlerResolver();
      expect(resolver.sitemap()).toEqual({ baseUrl: "" });
    });
  });

  describe("Mutation crawl", () => {
    it("resolves current state", () => {
      const resolver = new CrawlerResolver();
      expect(resolver.crawl("example.com", 12, 50, null)).toEqual(
        "Crawling example.com at 12 crawls per second (max: 50 crawls)"
      );
    });
  });
});
