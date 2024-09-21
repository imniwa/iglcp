import fs from 'node:fs';
import puppeteer from 'puppeteer';

const username = 'fallingin__fall';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'shell',
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
  const metadata = await Promise.all(images.map(async (image, index) => {
    const page = await browser.newPage();
    const viewSource = await page.goto(image);
    const buffer = await viewSource.buffer();
    const blob = new Blob([buffer], { type: viewSource.headers()['content-type'] });
    const ext = viewSource.headers()['content-type'].split('/')[1];
    const filePath = `./images/${username}/image-${index + 1}.${ext}`;
    fs.mkdirSync(`./images/${username}`, { recursive: true, mode: 0o755, ifExists: true });
    fs.writeFileSync(filePath, buffer);

    const id = new String(image.split('/')[5])
    const pos = id.indexOf('?')

    const meta = {
      id: id.substring(0, pos),
      url: image,
      filename: `image-${index + 1}.${ext}`,
      type: viewSource.headers()['content-type'],
      ext: viewSource.headers()['content-type'].split('/')[1],
      size: blob.size,
      blob: `data:${viewSource.headers()['content-type']};base64,${buffer.toString('base64')}`
    }
    return meta
  }));
  fs.writeFileSync(`./images/${username}/metadata.json`, JSON.stringify({ metadata }, null, 2));

})();