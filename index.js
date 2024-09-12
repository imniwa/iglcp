import fs from 'node:fs';
import puppeteer from 'puppeteer';

const username = '_yujin_an';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();

  await page.goto(`https://www.instagram.com/${username}?___a=1`, {
    waitUntil: 'networkidle2'
  });
  await page.evaluate('document.title');
  await page.waitForSelector('article');
  const images = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('article img'));
    return images.map(image => image.src);
  });
  images.map(async (image, index) => {
    const page = await browser.newPage();
    const viewSource = await page.goto(image);
    const buffer = await viewSource.buffer();
    const ext = viewSource.headers()['content-type'].split('/')[1];
    
    const filePath = `./images/${username}/image-${index + 1}.${ext}`;
    fs.mkdirSync(`./images/${username}`, { recursive: true, mode: 0o755, ifExists: true });
    fs.writeFileSync(filePath, buffer);
  })
})();