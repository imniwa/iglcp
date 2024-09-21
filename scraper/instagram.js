import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export default async function (username) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless_shell,
    ignoreHTTPSErrors: true,
    defaultViewport: null,
  });
  const page = await browser.newPage();

  await page.goto(`https://www.instagram.com/${username}?___a=1`, {
    waitUntil: "networkidle2",
  });
  await page.evaluate("document.title");
  await page.waitForSelector("article");
  const images = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll("article img"));
    return images.map((image) => image.src);
  });
  const metadata = await Promise.all(
    images.map(async (image, index) => {
      const page = await browser.newPage();
      const viewSource = await page.goto(image);
      const buffer = await viewSource.buffer();
      const blob = new Blob([buffer], {
        type: viewSource.headers()["content-type"],
      });
      const ext = viewSource.headers()["content-type"].split("/")[1];

      const id = new String(image.split("/")[5]);
      const pos = id.indexOf("?");

      const meta = {
        id: id.substring(0, pos),
        url: image,
        ext,
        type: viewSource.headers()["content-type"],
        size: blob.size,
      };
      return meta;
    })
  );
  await browser.close();
  return metadata;
}
