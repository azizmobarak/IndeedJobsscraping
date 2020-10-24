const jwt = require('jsonwebtoken');

const createtoken = (req, res) => {
    jwt.sign({ email: req.body.email }, 'accessToken', (err, token) => {
        if (err) {
            res.status(403).json({ message: 'error' })
        } else {
            res.status(200).json({
                message: "OK",
                data: { token: token }
            })
        }
    })
}


module.exports = { createtoken }