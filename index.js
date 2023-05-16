const readline = require('readline');
const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto('https://www.booking.com/searchresults.en-gb.html');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const destination = await new Promise(resolve => {
    rl.question('Destination: ', resolve);
  });

  const checkInDate = await new Promise(resolve => {
    rl.question('Check-in date (YYYY-MM-DD): ', resolve);
  });

  const checkOutDate = await new Promise(resolve => {
    rl.question('Check-out date (YYYY-MM-DD): ', resolve);
  });

  const adults = await new Promise(resolve => {
    rl.question('Number of adults: ', resolve);
  });

  const children = await new Promise(resolve => {
    rl.question('Number of children: ', resolve);
  });

  await page.waitForSelector('#ss');
  await page.type('#ss', destination);

  await page.waitForSelector('input[name="checkin_year"]');
  await page.type('input[name="checkin_year"]', checkInDate.substring(0, 4));
  await page.type('input[name="checkin_month_month"]', checkInDate.substring(5, 7).replace(/^0+/, ''));
  await page.type('input[name="checkin_month_day"]', checkInDate.substring(8, 10).replace(/^0+/, ''));

  await page.waitForSelector('input[name="checkout_year"]');
  await page.type('input[name="checkout_year"]', checkOutDate.substring(0, 4));
  await page.type('input[name="checkout_month_month"]', checkOutDate.substring(5, 7).replace(/^0+/, ''));
  await page.type('input[name="checkout_month_day"]', checkOutDate.substring(8, 10).replace(/^0+/, ''));

  await page.waitForSelector('#xp__guests__toggle');
  await page.click('#xp__guests__toggle');

  await page.waitForSelector('input[name="group_adults"]');
  await page.type('input[name="group_adults"]', adults);

  await page.waitForSelector('input[name="group_children"]');
  await page.type('input[name="group_children"]', children);

  await page.waitForSelector('.sb-searchbox__button');
  await page.click('.sb-searchbox__button');

  await page.waitForSelector('.sr-hotel__name');
  const hotelNames = await page.$$eval('.sr-hotel__name', elements => elements.map(el => el.textContent.trim()));
  const hotelPrices = await page.$$eval('.bui-price-display__value', elements => elements.map(el => el.textContent.trim()));
  console.log('Search Results:');
  for (let i = 0; i < hotelNames.length; i++) {
    console.log(`${i + 1}. ${hotelNames[i]} - ${hotelPrices[i]}`);
  }

  await browser.close();
  rl.close();
})();