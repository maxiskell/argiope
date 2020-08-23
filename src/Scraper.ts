import * as cheerio from "cheerio";

class Scraper {
  document: CheerioStatic;

  setDocument(html: string) {
    this.document = cheerio.load(html);
  }

  extractTitle(): string {
    return this.document("head > title").text().trim();
  }

  extractRelativeLinks(baseUrl: string): Set<string> {
    const links = new Set();

    const isRelative = (baseUrl: string, link: string) => {
      if (link.indexOf(baseUrl) === 0) return true;

      try {
        new URL(link);
        return false;
      } catch (err) {
        return true;
      }
    };

    this.document("a")
      .slice(0, 5)
      .each((_, link) => {
        const attr = link.attribs;

        if (
          attr.href &&
          !links.has(attr.href) &&
          isRelative(baseUrl, attr.href)
        )
          links.add(new URL(attr.href, baseUrl).toString());
      });

    return links as Set<string>;
  }
}

export default Scraper;
