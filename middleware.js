const Listing = require("./models/listing")
const ExpressError = require("./utils/ExpressError")
const { listingSchema } = require("./schema.js")
const { reviewSchema } = require("./schema.js")
const Review = require("./models/review.js")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.url = req.originalUrl;
        req.flash("error", "you must be logged in to create listing")
        return res.redirect("/user/login")
    }
    next();
}

module.exports.savedUrl = (req,res,next)=>{
    if(req.session.url){
        res.locals.url = req.session.url;
    }
    next();
}
module.exports.isOwner = async (req,res,next)=>{
    let {id}= req.params
     let listing = await Listing.findById(id);
    if( !listing.owner.equals(res.locals.currentUser._id) ){
      req.flash("error", "you are not owner of this listing")
     return res.redirect(`/listing/${id}`)
    }
    next();
}

module.exports.validateSchema = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
module.exports.isAuthor = async (req,res,next)=>{
   let reviewId = req.params.R_id;
   let id = req.params.id
     let review = await Review.findById(reviewId);
    if( !review.author.equals(res.locals.currentUser._id) ){
      req.flash("error", "you are not author of this review")
     return res.redirect(`/listing/${id}`)
    }
    next();
}