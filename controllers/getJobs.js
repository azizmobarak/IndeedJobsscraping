const Jobs = require('../modules/jobs');


const alljobs = (req, res) => {
    var pages = 0;

    Jobs.countDocuments({}, (err, count) => {
        if (err) console.log(err);
        else {
            pages = parseInt(count) / parseInt(req.params.limit);
            if (pages > parseInt(pages)) {
                pages = parseInt(pages) + 1;
            }
        }
    });

    Jobs.find({}, (err, doc) => {
            if (err) {
                console.log(err)
            } else {
                res.send({
                    pages: pages,
                    data: doc
                });
            }
        }).skip(parseInt(req.params.skip))
        .limit(parseInt(req.params.limit))
}

module.exports = { alljobs };