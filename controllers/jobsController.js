const puppeteer = require('puppeteer');
const Jobs = require('../modules/jobs');
const cron = require('node-cron');
const { formatError } = require('graphql');

const jobs = () => {
    console.log("last")
    cron.schedule('*/1 * * * *', () => {
        try {
            (async() => {
                const browser = await puppeteer.launch({
                    executablePath: "/usr/bin/chromium-browser",
                    args: ['--no-sandbox'],
                    headless: true
                });

                const page = await browser.newPage();

                (await page).setRequestInterception(true);

                (await page).on('request', (req) => {
                    if (req.resourceType() === 'image' || req.resourceType() === 'script' || req.resourceType() === 'stylesheet' || req.resourceType() === 'font') {
                        req.abort();
                    } else {
                        req.continue();
                    }
                });

                var pageNumber = 2;

                var count = 0;
                var jobList = [];
                var collectjoblists = [];

                while (count < pageNumber) {

                    try {
                        await page.goto('https://www.indeed.fr/emplois?q=Jobs+France&start=' + count * 10, { waitUntil: "domcontentloaded", timeout: 0 });
                    } catch {
                        //982011 : error will opening the page
                        //await res.json({ message: "error", data: "error code : 289011" })
                    }
                    count++;

                    try {
                        jobList = await page.evaluate(function async() {
                            try {
                                var titles = document.querySelectorAll('a.jobtitle');
                                var locations = document.querySelectorAll('span.location');
                                var descriptions = document.querySelectorAll('div.summary ul');

                                var job = [];

                                for (var i = 0; i < titles.length; i++) {

                                    job.push({
                                        url: titles[i].href,
                                        title: titles[i].textContent,
                                        location: locations[i].textContent,
                                        description: descriptions[i].textContent,
                                    })
                                }
                                return job;
                            } catch (err) {
                                //336789 : error will fetching arround pages
                                // res.json({ message: "error", data: "error code : 336789" })
                                // await browser.close();
                            }
                        });

                        console.log('near list')
                        console.log(jobList)
                        await collectjoblists.push(jobList);

                    } catch {
                        //543889 : in the first function when trying to get the data from pages, each page
                        /*  res.json({
                              message: "error",
                              data: "error code : 543889"
                         });*/
                    }
                }
                console.log("wait")
                await page.waitFor(4000);
                //format array
                const FullList = await FormatArray(collectjoblists, collectjoblists.length)

                // collect jobs main content (application url & article)
                try {
                    await getjobcontent(browser, FullList, pageNumber);
                    // res.json({ message: "OK", data: "Great Job , Success" })
                } catch {
                    //234599 : error when fetching in the second function to collect details
                    //  res.json({ message: "error", data: "error code : 234599" })
                    // await browser.close();
                }

                await browser.close();

            })();
        } catch {
            //1000 the whole app code contain a bug
            /* res.json({
                 message: "error",
                 data: "error code : 1000"
             });*/
        }
    });
}


//format the array
const FormatArray = async(array, length) => {
    var itembyitem = [];
    try {
        array.map((item) => {
            for (var i = 0; i < length; i++) {
                itembyitem.push(item[i]);
            }
            console.log(item)
        });
    } catch (e) {
        console.log(e);
    }
    return itembyitem;
}


// get jobs content by url of collected details in previews function
const getjobcontent = async(browser, arry, pagenumber) => {
    const page = await browser.newPage();

    //to delete older data
    //  Deletolddata();

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

    var fulltab = [];

    for (let i = 0; i < arry.length; i++) {

        var url = arry[i].url;

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });
        await page.waitForSelector('#jobDescriptionText');

        const result = await page.evaluate(() => {
            var mainNode = document.querySelector('div#jobDescriptionText').innerText;
            var apply = document.querySelector('#applyButtonLinkContainer a').href;
            return {
                content: mainNode,
                application: apply
            };
        });

        newListJobs = new Jobs({
            details: arry[i],
            main: result
        });
        newListJobs.save((err, doc) => {
            if (err) console.log(err);
            else {
                console.log("added");
            }
        });

    }

}

//delete some old data from the database
const Deletolddata = () => {
    Jobs.countDocuments((err, count) => {
        if (err) console.log(err)
        else {
            if (count > 100) {
                var date = new Date();
                Jobs.deleteMany({ 'date': { $lt: new Date(date.getFullYear() + "-" + date.getDate() + "-" + date.getDay()) } }, (err, doc) => {
                    if (err) {
                        console.log('error')
                    } else {
                        console.log(doc);
                    }
                }).skip(45)
            }
        }
    });
}



module.exports = { jobs }