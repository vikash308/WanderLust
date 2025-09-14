const express = require("express");
const router = express.Router();
const { listingSchema } = require("../schema.js")
const wrapAsync = require("../utils/wrapasync.js")
const Listing = require("../models/listing.js")
const ExpressError = require("../utils/ExpressError.js")


const validateSchema = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const listings = await Listing.find();
    res.render("Listing/index.ejs", { listings });
  })
);

router.get("/new", (req, res) => {
  res.render("Listing/new.ejs");
});

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "listing you requested is not exist")
      res.redirect("/listing")
    }
    res.render("Listing/list.ejs", { listing });
  })
);

router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "listing you requested is not exist")
      res.redirect("/listing")
    } res.render("Listing/edit", { listing });
  })
);

router.post(
  "/",
  validateSchema,
  wrapAsync(async (req, res, next) => {
    console.log(req.body.listing)
    const list = new Listing(req.body.listing);
    await list.save();
    req.flash("success", "New Listing Created")
    res.redirect("/listing");
  })
);

router.put(
  "/:id",
  validateSchema,
  wrapAsync(async (req, res, next) => {
    let id = req.params.id;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "listing has been updated")
    res.redirect("/listing");
  })
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing has been deleted")
    res.redirect("/listing");
  })
);



module.exports = router;
