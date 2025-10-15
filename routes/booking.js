const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync");
const { isLoggedIn } = require("../middleware");
const bookingController = require("../controllers/booking");

router.get("/:id/book", isLoggedIn, wrapAsync(bookingController.book));
router.post("/:id/book", isLoggedIn, wrapAsync(bookingController.bookForm));
router.get("/:id/payment", isLoggedIn, wrapAsync(bookingController.payment));
router.get("/confirm", isLoggedIn,wrapAsync( (req, res) => {
    res.render("Listing/confirm");
}));

module.exports = router;
