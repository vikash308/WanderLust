const User = require("../models/userModel");
const { route } = require("./listing");

module.exports.signup = async (req, res) => {
    res.render("users/signup")
}

module.exports.addSignup = async (req, res) => {
    try {
        let { username, password, email } = req.body
        const newUser = new User({ email, username })
        const registeredUser = await User.register(newUser, password)
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash("success", "You are registered")
            res.redirect("/listing")
        })

    } catch (error) {
        req.flash("error", error.message)
        res.redirect("/user/signup")
    }
}

module.exports.login = (req, res) => {
    res.render("users/login")
}

module.exports.postLogin = async (req, res) => {
    req.flash("success", "welcome back to wonderLust")
    const url = res.locals.url || "/listing"
    res.redirect(url)
}

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "You are loggedOut Successfully")
        res.redirect("/listing")
    })
}