const Listing = require("../models/listing");
const dayjs = require("dayjs");

module.exports.book = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).send("Listing not found");
    res.render("Listing/bookForm", { listing });
};

let totalAmount;

module.exports.bookForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).send("Listing not found");

    const { checkIn, checkOut, guests, phone, email, notes } = req.body;

    const nights = dayjs(checkOut).diff(dayjs(checkIn), "day");
    if (nights <= 0) return res.status(400).send("Check-out must be after check-in.");

    const basePrice = listing.price * nights;
    const discount = 500;
    const taxes = 300;
    const total = basePrice - discount + taxes;

    totalAmount = total;

    res.render("Listing/book", {
        listing,
        checkIn,
        checkOut,
        guests,
        phone,
        email,
        notes,
        nights,
        discount,
        taxes,
        total,
    });
};

module.exports.payment = (req, res) => {
    res.render("Listing/paymentPage", { total: totalAmount });
};
