import Argiope from "./Argiope";

if (!process.argv[2]) {
  console.log("Please, specify a start url for the crawler");
} else {
  const url = process.argv[2];
  const crawlsPerSecond = parseInt(process.argv[3]) || 1;
  const crawler = new Argiope(url, crawlsPerSecond);
  crawler.start();
}
