const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const Port = process.env.PORT || 3333;
const router = require('./routes');
const mongoose = require('mongoose');
var { graphqlHTTP } = require('express-graphql');
const { schema } = require('./schema');
const root = require('./qrfqlroutes');

//app configuration
app.use(cors());
app.use(bodyparser.json());
app.use(cookieparser());
app.use('/api', router);


const { jobs } = require('./controllers/jobsController');
const { buildSchema } = require('graphql');
//onnect to database
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }, async(err) => {
    if (err) console.log(err);
    else {
        //start scraping
        console.log('connected to database')
        await jobs();
    }
});


//setup QRAFQL routes
app.use('/api/gql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

// runing server
app.listen(Port, () => {
    console.log("connected");
})