if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const bookingRouter = require("./routes/booking.js")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate") 
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session")
const flash = require("connect-flash")
const User = require("./models/userModel.js")
const passport = require("passport");
const LocalStrategy = require("passport-local")
const mongoStore = require("connect-mongo")


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
    mongoose.connect(process.env.DB_URL)
}

const store = mongoStore.create({
    mongoUrl:process.env.DB_URL,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
})
store.on("error", ()=>{
    console.log("error in mongo session ",err)
})
const sessionoption  = {
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60* 60*1000,
        maxAge: 7 * 24 * 60* 60*1000,
        httpOnly:true
    },
    store
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
    res.locals.currentUser = req.user || null;
    next();
})

// Routes
app.get("/", (req, res) => {
    res.redirect("/listing")
})
app.use("/listing", listingRouter)
app.use("/listing/:id/reviews", reviewRouter)
app.use("/user", userRouter)
app.use("/booking", bookingRouter)


app.use((req, res, next) => {
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