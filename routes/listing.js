const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js")
const Listing = require("../models/listing.js")
const {isLoggedIn, isOwner,validateSchema} = require("../middleware.js")


router.get(
  "/",
  wrapAsync(async (req, res) => {
    const listings = await Listing.find();
    res.render("Listing/index.ejs", { listings });
  })
);

router.get("/new", isLoggedIn,(req, res) => {
  res.render("Listing/new.ejs");
});

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
    if (!listing) {
      req.flash("error", "listing you requested is not exist")
      res.redirect("/listing")
    }
    res.render("Listing/list.ejs", { listing });
  })
);

router.get(
  "/:id/edit", isLoggedIn,isOwner,
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
  "/",isLoggedIn,
  validateSchema,
  wrapAsync(async (req, res, next) => {
    console.log(req.body.listing)
    const list = new Listing(req.body.listing);
    list.owner = req.user._id;
    await list.save();
    req.flash("success", "New Listing Created")
    res.redirect("/listing");
  })
);

router.put(
  "/:id", isLoggedIn,isOwner,
  validateSchema,
  wrapAsync(async (req, res, next) => {
    let id = req.params.id;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "listing has been updated")
    res.redirect("/listing");
  })
);

router.delete(
  "/:id",isLoggedIn,isOwner,
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing has been deleted")
    res.redirect("/listing");
  })
);

module.exports = router;
