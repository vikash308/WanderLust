const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js")
const { isLoggedIn, isOwner, validateSchema } = require("../middleware.js")
const listingController = require("../controllers/listing.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })


router.route("/")
.get(wrapAsync(listingController.index))
.post( isLoggedIn,upload.single("listing[image]"),validateSchema,
   wrapAsync(listingController.addNewListing));



router.get("/new", isLoggedIn, listingController.renderNewForm);
router.get("/category",wrapAsync(listingController.showCategory) )


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put( isLoggedIn, isOwner, upload.single("listing[image]"), validateSchema,wrapAsync(listingController.editListing))
.delete( isLoggedIn, isOwner,wrapAsync(listingController.deleteListing));

router.get("/:id/edit",  isLoggedIn, isOwner,wrapAsync(listingController.editlist));


module.exports = router;
