const express = require("express");
const { route } = require("./listing");
const router = express.Router();
const User = require("../models/userModel");
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");


router.get("/signup", async (req, res) => {
    res.render("users/signup")
})


router.post("/signup", wrapasync(async (req, res) => {
    try {
        let { username, password, email } = req.body
        const newUser = new User({ email, username })
        const registeredUser = await User.register(newUser, password)
        req.flash("success", "You are registered")
        res.redirect("/user/login")
    } catch (error) {
        req.flash("error", error.message)
        res.redirect("/user/signup")
    }
}))

router.get("/login", (req, res) => {
    res.render("users/login")
})

router.post("/login", passport.authenticate("local", { failureRedirect: "/user/login", failureFlash: true }), wrapasync(async (req, res) => {
    req.flash("success", "welcome back to wonderLust")
    res.redirect("/listing")
}))

module.exports = router;