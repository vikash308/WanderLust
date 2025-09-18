const express = require("express")
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapasync.js")

const {validateReview, isLoggedIn, isAuthor} = require("../middleware.js")
const reviewController = require("../controllers/review.js")

router.post("/",isLoggedIn,validateReview,
  wrapAsync(reviewController.addReview)
);

router.delete("/:R_id",isLoggedIn,isAuthor,
  wrapAsync(reviewController.deleteReview)
);


module.exports = router;