const puppeteer = require("puppeteer");
const os = require("os");

async function getPage(url) {
  const browser = await puppeteer.launch({
    executablePath:
      os.platform() !== "darwin" ? "/usr/bin/chromium-browser" : undefined,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  return page;
}

module.exports = getPage;
