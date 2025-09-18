const express = require("express");

const router = express.Router();

const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const { savedUrl } = require("../middleware");
const userController = require("../controllers/user")

router.route("/signup")
.get(userController.signup )
.post( wrapasync(userController.addSignup))


router.route("/login")
.get(userController.login)
.post(savedUrl, 
    passport.authenticate("local", 
        {
             failureRedirect: "/user/login",failureFlash: true 
        }), 
    wrapasync(userController.postLogin))


router.get("/logout", userController.logout)
module.exports = router;