const express = require("express");
const { route } = require("./listing");
const router = express.Router();
const User = require("../models/userModel");
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const { savedUrl } = require("../middleware");


router.get("/signup", async (req, res) => {
    res.render("users/signup")
})


router.post("/signup", wrapasync(async (req, res) => {
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
}))

router.get("/login", (req, res) => {
    res.render("users/login")
})

router.post("/login",savedUrl, passport.authenticate("local", { failureRedirect: "/user/login", failureFlash: true }), wrapasync(async (req, res) => {
    req.flash("success", "welcome back to wonderLust")
    const url = res.locals.url || "/listing"
    res.redirect(url)
}))

router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "You are loggedOut Successfully")
        res.redirect("/listing")
    })
})
module.exports = router;