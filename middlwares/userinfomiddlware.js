const userInfo = (req, res, next) => {
    var email = req.body.email;
    var name = req.body.name;
    console.log({ email: email, name: name })
    next();
}



module.exports = { userInfo }