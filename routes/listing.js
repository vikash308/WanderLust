const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js")
const { isLoggedIn, isOwner, validateSchema } = require("../middleware.js")
const listingController = require("../controllers/listing.js")


router.route("/")
.get(wrapAsync(listingController.index))
.post( isLoggedIn,validateSchema, wrapAsync(listingController.addNewListing));



router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put( isLoggedIn, isOwner,validateSchema,wrapAsync(listingController.editListing))
.delete( isLoggedIn, isOwner,wrapAsync(listingController.deleteListing));


router.get("/:id/edit", isLoggedIn, isOwner,
  wrapAsync(listingController.editListingForm)
);

module.exports = router;
