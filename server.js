
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate") 
const ExpressError = require("./utils/ExpressError.js")


// Middlewares
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"))
app.use(express.urlencoded({ extended: true }))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")))


// DB onnection 
main().then(() => {
    console.log("connected")
}).catch((err) => {
    console.log(err)
})

async function main() {
    mongoose.connect("mongodb://localhost:27017/wonderlust")
}

// Routes
app.get("/", (req, res) => {
    res.send("hello world")
})

app.use("/listing", listingRouter)
app.use("/listing/:id/reviews", reviewRouter)

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