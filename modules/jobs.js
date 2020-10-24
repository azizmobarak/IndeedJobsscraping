const mongoose = require("mongoose");


var date = new Date();
const JobsSchema = mongoose.Schema({
    details: {
        url: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true
        }
    },
    main: {
        content: {
            type: String,
            required: true
        },
        application: {
            type: String,
            required: true
        }
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const Jobs = mongoose.model('Jobs', JobsSchema);

module.exports = Jobs;