const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const Port = process.env.PORT || 3333;
const router = require('./routes');
const mongoose = require('mongoose');

//app configuration
app.use(cors());
app.use(bodyparser.json());
app.use(cookieparser());
app.use('/api', router);


//onnect to database
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) console.log(err);
    else {
        console.log('connected to database')
    }
})

// runing server
app.listen(Port, () => {
    console.log("connected");
})