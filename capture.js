const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log("Navigating to dashboard...");
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'dashboard.png', fullPage: true });
    
    console.log("Navigating to jobs...");
    await page.goto('http://localhost:3000/jobs', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Wait for GSAP animations
    await page.screenshot({ path: 'jobs.png', fullPage: true });
    
    console.log("Screenshots captured successfully.");
  } catch (err) {
    console.error("Error capturing screenshot:", err);
  } finally {
    await browser.close();
  }
})();
