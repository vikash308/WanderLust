const Review = require("../models/review.js")
const Listing = require("../models/listing")


module.exports.addReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview._id);
    await newReview.save();
    await listing.save();
     req.flash("success" , "New Review Created")
    res.redirect(`/listing/${listing._id}`);
  }

  module.exports.deleteReview = async (req, res, next) => {
    let { id, R_id } = req.params;
    await Review.findByIdAndDelete(R_id);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: R_id } });
     req.flash("success" , "Review deleted")
    res.redirect(`/listing/${id}`);
  }