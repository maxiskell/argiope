import Argiope from "./Argiope";

if (!process.argv[2]) {
  console.log("Please, specify a start url for the crawler");
} else {
  const url = process.argv[2];
  const crawler = new Argiope(url);
  crawler.start();
}
