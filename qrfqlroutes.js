const { alljobs } = require("./controllers/getJobs");

var root = {
    hello: () => "hellooo",
    person: () => {
        return {
            "name": "test",
            "email": "hrr"
        }
    },
    jobs: () => {
        return alljobs()
    }
};

module.exports = root;