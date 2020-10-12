const puppeteer = require('puppeteer');


const Jobpage = (req, res) => {
    (async() => {
        const browser = await puppeteer.launch({
            timeout: 50000,
            headless: false
        });

        const page = await browser.newPage();

        await page.setRequestInterception(true);
        await page.on("request", (req) => {
            if (
                req.resourceType() === "image" ||
                req.resourceType === "stylesheet" ||
                req.resourceType() === "font"
            ) {
                req.abort();
            } else {
                req.continue();
            }
        });

        var url = req.body.url;

        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#jobDescriptionText');
        const result = await page.evaluate(() => {
            var mainNode = document.querySelector('div#jobDescriptionText').innerText;
            var apply = document.querySelector('#applyButtonLinkContainer a').href;
            return {
                statut: "OK",
                data: {
                    content: mainNode,
                    application: apply
                }
            };
        })


        await browser.close();
        res.send(result)

    })();
}


module.exports = { Jobpage };