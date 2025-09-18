const express = require("express")
const router = express.Router({mergeParams:true});
const Review = require("../models/review.js")
const wrapAsync = require("../utils/wrapasync.js")
const Listing = require("../models/listing.js")
const {validateReview, isLoggedIn, isAuthor} = require("../middleware.js")

router.post(
  "/",isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview._id);
    await newReview.save();
    await listing.save();
     req.flash("success" , "New Review Created")
    res.redirect(`/listing/${listing._id}`);
  })
);

router.delete(
  "/:R_id",isLoggedIn,isAuthor,
  wrapAsync(async (req, res, next) => {
    let { id, R_id } = req.params;
    await Review.findByIdAndDelete(R_id);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: R_id } });
     req.flash("success" , "Review deleted")
    res.redirect(`/listing/${id}`);
  })
);


module.exports = router;