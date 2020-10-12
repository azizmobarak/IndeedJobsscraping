const express = require('express');
const app = express();
const router = express.Router();


const { jobs } = require('./controllers/jobsController');
const { Jobpage } = require('./controllers/JobpageController');
const { userInfo } = require('./middlwares/userinfomiddlware');
const { createtoken } = require('./controllers/CreateTokenController');


//routes
router.route('/jobs/:page').get(jobs);
router.route('/jobdetail').post(Jobpage);
router.route('/gettoken').post(userInfo, createtoken);



module.exports = router;