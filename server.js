
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate") 
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session")
const flash = require("connect-flash")
const User = require("./models/userModel.js")
const passport = require("passport");
const LocalStrategy = require("passport-local")

// Middlewares
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"))
app.use(express.urlencoded({ extended: true }))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")))
app.use(express.json())


// DB onnection 
main().then(() => {
    console.log("connected")
}).catch((err) => {
    console.log(err)
})

async function main() {
    mongoose.connect("mongodb://localhost:27017/wonderlust")
}

const sessionoption  = {
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60* 60*1000,
        maxAge: 7 * 24 * 60* 60*1000,
        httpOnly:true
    }
}

app.use(session(sessionoption));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currentUser = req.user;
    next();
})

// Routes
app.get("/", (req, res) => {
    res.redirect("/listing")
})

app.use("/listing", listingRouter)
app.use("/listing/:id/reviews", reviewRouter)
app.use("/user", userRouter)

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"))
})

// Error Handling
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    console.log(err);
    res.status(statusCode).render("error.ejs", { message })
})


// Server Listening
const port = 3000;
app.listen(port, () => {
    console.log(`server is listening on ${port}`)
})