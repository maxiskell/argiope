import Scraper from "./Scraper";

let scraper: Scraper;

beforeAll(() => {
  scraper = new Scraper();
});

afterEach(() => {
  scraper.setDocument("");
});

describe("Scraper", () => {
  describe("extractTitle", () => {
    it("Should return the trimmed content from <title>", () => {
      scraper.setDocument(`
      <html>
        <head>
          <title>  Spaced Test Title   </title>
        </head>
        <body>
          <h1>I don't mind</h1>
        </body>
      </html>
    `);

      const title = scraper.extractTitle();

      expect(title).toEqual("Spaced Test Title");
    });
  });

  describe("extractRelativeLinks", () => {
    describe("Given the document contains external, relative and absolute links", () => {
      it("Should contain only local absolute links without hashes or query strings", () => {
        scraper.setDocument(`
          <html>
            <head>
              <title>  Spaced Test Title   </title>
            </head>
            <body>
              <h1>I don't mind</h1>
              <nav>
                <a href="https://example.com/posts">Posts</a>
                <a href="/videos">Videos</a>
                <a href="/photos#latest">Latest Photos</a>
                <a href="https://fb.com/e-x-ample">Our FB Page</a>
                <a href="/login?ref=home">Log In</a>
              </nav>
            </body>
          </html>
        `);

        const links = scraper.extractRelativeLinks("https://example.com");

        expect(links.has("https://fb.com/e-x-ample")).toBe(false);
        expect(links.has("https://example.com/photos#latest")).toBe(false);
        expect(links.has("https://example.com/login?ref=home")).toBe(false);

        expect(links.has("https://example.com/posts")).toBe(true);
        expect(links.has("https://example.com/videos")).toBe(true);
        expect(links.has("https://example.com/photos")).toBe(true);
        expect(links.has("https://example.com/login")).toBe(true);
      });
    });
  });
});
