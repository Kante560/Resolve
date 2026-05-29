// eslint-disable-next-line @typescript-eslint/no-require-imports
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => {
    console.log(`[${msg.type()}] ${msg.text()}`);
  });
  page.on('pageerror', err => {
    console.log(`[pageerror] ${err.message}`);
  });

  await page.goto('http://localhost:3002');
  await page.waitForTimeout(3000);
  
  // Set to mobile viewport
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screen_mobile.png' });
  
  // Set back to desktop
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screen13.png' });
  
  // Scroll to How it Works
  await page.evaluate(() => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'auto' });
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screen14.png' });

  // Scroll to Why Base section
  await page.evaluate(() => {
    document.getElementById('why-base')?.scrollIntoView({ behavior: 'auto' });
  });
  await page.waitForTimeout(1000);

  // Simulate hover on the TiltedCard
  const card = await page.locator('.why-image-anim');
  if (card) {
    const box = await card.boundingBox();
    if (box) {
      // Hover slightly off-center to trigger the tilt
      await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.75);
      await page.waitForTimeout(1000); // Wait for spring animation
    }
  }

  await page.screenshot({ path: 'screen11.png' });

  // Scroll to Protocol section
  await page.evaluate(() => {
    document.getElementById('protocol')?.scrollIntoView({ behavior: 'auto' });
  });
  await page.waitForTimeout(1000);

  // Simulate hover on the Contract TiltedCard
  const contractCard = await page.locator('.contract-anim').first();
  if (contractCard) {
    const box2 = await contractCard.boundingBox();
    if (box2) {
      // Hover slightly off-center to trigger the tilt
      await page.mouse.move(box2.x + box2.width * 0.25, box2.y + box2.height * 0.75);
      await page.waitForTimeout(1000); // Wait for spring animation
    }
  }
  
  await page.screenshot({ path: 'screen12.png' });
  
  // Visit Dashboard
  await page.goto('http://localhost:3002/dashboard', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screen_dashboard.png' });

  // Visit Client Portal
  await page.goto('http://localhost:3002/client', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screen_client.png' });

  // Visit Freelancer Portal
  await page.goto('http://localhost:3002/freelancer', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screen_freelancer.png' });
  
  await browser.close();
})();
