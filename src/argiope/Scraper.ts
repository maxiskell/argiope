import * as cheerio from "cheerio";

class Scraper {
  document: CheerioStatic;

  /**
   * Process the given html string into the local `document` property.
   *
   * @param html string
   */
  setDocument(html: string) {
    this.document = cheerio.load(html);
  }

  /**
   * Return the title of the document.
   */
  extractTitle(): string {
    return this.document("head > title").text().trim();
  }

  /**
   * Return a Set<string> containing all the links local to the `baseUrl`
   * given (absolute and relative) contained in the `document` without its
   * hashes and querystrings.
   *
   * @param baseUrl string
   */
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

    this.document("a").each((_, link) => {
      const attr = link.attribs;

      if (attr.href && !links.has(attr.href) && isRelative(baseUrl, attr.href))
        links.add(
          new URL(attr.href.split(/[?#]/i).shift(), baseUrl).toString()
        );
    });

    return links as Set<string>;
  }
}

export default Scraper;
