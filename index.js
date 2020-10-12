const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const Port = process.env.PORT || 3333;
const router = require('./routes');

//app configuration
app.use(cors());
app.use(bodyparser.json());
app.use(cookieparser());
app.use('/api', router);


// runing server
app.listen(Port, () => {
    console.log("connected");
})