const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3099', { waitUntil: 'networkidle2', timeout: 30000 });

  // Dismiss promo popup
  await page.evaluate(() => {
    localStorage.setItem('vellora-promo-dismissed', 'true');
    localStorage.setItem('vellora-promo-dismissed-at', String(Date.now()));
  });
  await page.reload({ waitUntil: 'networkidle2', timeout: 30000 });

  // Scroll entire page to trigger all Reveal animations
  await page.evaluate(async () => {
    const delay = ms => new Promise(r => setTimeout(r, ms));
    const totalHeight = document.body.scrollHeight;
    const step = 400;
    for (let y = 0; y < totalHeight; y += step) {
      window.scrollTo(0, y);
      await delay(150);
    }
    // Scroll back to top
    window.scrollTo(0, 0);
    await delay(500);
    // Scroll to bottom once more to ensure everything triggered
    window.scrollTo(0, document.body.scrollHeight);
    await delay(500);
    window.scrollTo(0, 0);
    await delay(300);
  });

  // Wait for animations to settle
  await new Promise(r => setTimeout(r, 2000));

  // Hide sticky navbar
  await page.evaluate(() => {
    const header = document.querySelector('header');
    if (header) header.style.display = 'none';
  });

  const outDir = 'C:\\Users\\Jimwel\\Project\\vellora\\screenshots';
  const fs = require('fs');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const sections = [
    { selector: '[data-section="home-hero"]', name: '01-hero' },
    { selector: '[data-section="best-sellers"]', name: '02-best-sellers' },
    { selector: '[data-section="why-vellora"]', name: '03-why-vellora' },
    { selector: '[data-section="new-arrivals"]', name: '04-new-arrivals' },
    { selector: '[data-section="shop-by-category"]', name: '05-shop-by-category' },
    { selector: '[data-section="testimonials"]', name: '06-testimonials' },
    { selector: '[data-section="benefits-bar"]', name: '07-benefits' },
    { selector: '[data-section="newsletter"]', name: '08-newsletter' },
    { selector: '[data-section="home-footer"]', name: '10-footer' },
  ];

  for (const sec of sections) {
    try {
      const el = await page.$(sec.selector);
      if (el) {
        await el.screenshot({ path: `${outDir}\\${sec.name}.png` });
        console.log(`Captured: ${sec.name}`);
      } else {
        console.log(`Not found: ${sec.selector}`);
      }
    } catch (e) {
      console.log(`Error on ${sec.name}: ${e.message}`);
    }
  }

  // FAQ
  try {
    const faqFound = await page.evaluate(() => {
      const headings = document.querySelectorAll('h2');
      for (const h of headings) {
        if (h.textContent.includes('Frequently')) {
          const section = h.closest('section');
          if (section) {
            section.setAttribute('data-capture', 'faq');
            return true;
          }
        }
      }
      return false;
    });
    if (faqFound) {
      const el = await page.$('[data-capture="faq"]');
      if (el) {
        await el.screenshot({ path: `${outDir}\\09-faq.png` });
        console.log('Captured: 09-faq');
      }
    } else {
      console.log('Not found: FAQ section');
    }
  } catch (e) {
    console.log(`Error on faq: ${e.message}`);
  }

  await browser.close();
  console.log('Done');
})();
