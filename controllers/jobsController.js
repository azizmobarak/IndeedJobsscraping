const puppeteer = require('puppeteer');

const jobs = (req, res) => {
    (async() => {
        const browser = await puppeteer.launch({
            timeout: 50000,
            headless: true
        });

        const page = await browser.newPage();

        (await page).setRequestInterception(true);

        (await page).on('request', (req) => {
            if (req.resourceType() === 'image' || req.resourceType() === 'stylesheet' || req.resourceType() === 'font') {
                req.abort();
            } else {
                req.continue();
            }
        });

        var pageNumber = parseInt(req.params.page) * 10;
        await page.goto('https://www.indeed.fr/emplois?q=Jobs+France&start=' + pageNumber, { waitUntil: "domcontentloaded" });


        const jobList = await page.evaluate(() => {
            try {
                var titles = document.querySelectorAll('a.jobtitle');
                var locations = document.querySelectorAll('span.location');
                var descriptions = document.querySelectorAll('div.summary ul');

                var job = [];

                for (var i = 0; i < 15; i++) {
                    job.push({
                        url: titles[i].href,
                        title: titles[i].textContent,
                        location: locations[i].textContent,
                        description: descriptions[i].textContent
                    })
                }
                return {
                    success: "OK",
                    length: job.length,
                    data: job
                };
            } catch {
                return {
                    success: "NO",
                    length: job.length,
                    data: job
                };
            }
        });

        //console.log(result);
        // (await page).close();
        await browser.close();
        res.json(jobList);
    })();
}



module.exports = { jobs }