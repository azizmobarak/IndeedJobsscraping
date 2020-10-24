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
router.route('/test').get((req, res) => {
    res.send('test');
});


module.exports = router;