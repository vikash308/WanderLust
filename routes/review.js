const express = require("express")
const router = express.Router({mergeParams:true});
const Review = require("../models/review.js")
const { reviewSchema } = require("../schema.js")
const wrapAsync = require("../utils/wrapasync.js")
const Listing = require("../models/listing.js")


const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview._id);
    await newReview.save();
    await listing.save();
     req.flash("success" , "New Review Created")
    res.redirect(`/listing/${listing._id}`);
  })
);

router.delete(
  "/:R_id",
  wrapAsync(async (req, res, next) => {
    let { id, R_id } = req.params;
    await Review.findByIdAndDelete(R_id);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: R_id } });
     req.flash("success" , "Review deleted")
    res.redirect(`/listing/${id}`);
  })
);


module.exports = router;