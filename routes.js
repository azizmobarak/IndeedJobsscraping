const express = require('express');
const app = express();
const router = express.Router();
const Jobs = require('./modules/jobs.js');


const { jobs } = require('./controllers/jobsController');
const { userInfo } = require('./middlwares/userinfomiddlware');
const { createtoken } = require('./controllers/CreateTokenController');
const { alljobs } = require('./controllers/getJobs');


//routes
router.route('/jobs/:page').get(jobs);
router.route('/gettoken').post(userInfo, createtoken);
router.route('/getjobs/:skip/:limit').get(alljobs)
router.route('/test').post((req, res) => {
    var jobs = new Jobs({
        details: {
            url: "url",
            title: "title",
            location: "location",
            description: 'description',
        },
        main: {
            content: "content",
            application: "application"
        }
    });
    jobs.save((err, doc) => {
        if (err) console.log(err);
        else {
            res.send(doc)
        }
    })
});


module.exports = router;