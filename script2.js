const playwright = require('playwright');
(async () => {
  try {
    const browser = await playwright.chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle' });
    console.log("Page loaded");
    const html = await page.evaluate(() => document.body.innerHTML);
    console.log("HTML length:", html.length);
    await browser.close();
  } catch(e) { console.error(e); }
})();
