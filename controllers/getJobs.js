const Jobs = require('../modules/jobs');


const alljobs = async() => {
    var pages = 0;

    await Jobs.countDocuments({}, async(err, count) => {
        if (err) console.log(err);
        else {
            pages = parseInt(count) / parseInt(2);
            if (pages > parseInt(pages)) {
                pages = parseInt(pages) + 1;
            }
        }
    });

    await Jobs.find({}, async(err, doc) => {
            if (err) {
                console.log(err)
            } else {
                return {
                    pages: pages,
                    data: doc
                };
            }
        }).skip(parseInt(0))
        .limit(parseInt(20))
}

module.exports = { alljobs };