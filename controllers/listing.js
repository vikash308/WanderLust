const Listing = require("../models/listing")
const dayjs = require('dayjs'); // Optional, for date calculation

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function geocode(locationName) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.length > 0) {
        return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
        };
    }
    return null;
}

module.exports.index = (async (req, res) => {
  const listings = await Listing.find();
  res.render("Listing/index.ejs", { listings });
})

module.exports.renderNewForm = (req, res) => {
  res.render("Listing/new.ejs");
}

module.exports.showListing = async (req, res) => {
  let id = req.params.id;
  let listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
  if (!listing) {
    req.flash("error", "listing you requested is not exist")
    res.redirect("/listing")
  }
  res.render("Listing/list.ejs", { listing });
}

module.exports.editListingForm = async (req, res) => {
  let id = req.params.id;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "listing you requested is not exist")
    res.redirect("/listing")
  }
  let originalUrl = listing.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/w_250")
  res.render("Listing/edit", { listing , originalUrl});
}

module.exports.addNewListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const list = new Listing(req.body.listing);
  list.owner = req.user._id;
  list.image = { url, filename }

   let coords = { lat: 20.5937, lng: 78.9629 };
  if (list.location && list.country) {
      const geocoded = await geocode(`${list.location}, ${list.country}`);
      if (geocoded && geocoded.lat && geocoded.lng) coords = geocoded;   
  }
  let lng = coords.lng , lat = coords.lat;
  list.geometry = {
    type:"Point",
    coordinates:[lat, lng]
  }
  await list.save();
  req.flash("success", "New Listing Created")
  res.redirect("/listing");
}

module.exports.editListing = async (req, res, next) => {
  let id = req.params.id;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename }
    await listing.save();
  }
  req.flash("success", "listing has been updated")
  res.redirect("/listing");
}

module.exports.deleteListing = async (req, res) => {
  let id = req.params.id;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "listing has been deleted")
  res.redirect("/listing");
}

module.exports.showCategory = async (req,res)=>{
 const { category } = req.query;

  let listings;
  if (category) {
    listings = await Listing.find({ category }); 
  } else {
    listings = await Listing.find(); 
  }

  res.render("Listing/index", { listings, category });
}


module.exports.search = async (req,res)=>{
  let location = req.query.search;
  let listings = await Listing.find({location});
  res.render("Listing/index", { listings });
}


module.exports.book = async (req, res) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).send('Listing not found');
    }

    res.render("Listing/bookForm", { listing }); 
  } catch (err) {
    console.error("Error fetching listing:", err);
    res.status(500).send("Server error");
  }
};

let totalAmount;

module.exports.bookForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    return res.status(404).send("Listing not found");
  }

  const { checkIn, checkOut, guests, phone, email, notes } = req.body;

  // Calculate number of nights
  const nights = dayjs(checkOut).diff(dayjs(checkIn), 'day');
  if (nights <= 0) {
    return res.status(400).send("Check-out must be after check-in.");
  }

  // Pricing calculations
  const basePrice = listing.price * nights;
  const discount = 500; // You can customize this
  const taxes = 300;    // Or calculate percentage
  const total = basePrice - discount + taxes;
  totalAmount=total;
  // Now render the booking confirmation page
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
    total
  });
};

module.exports.payment= (req,res)=>{
  let total = totalAmount;
  res.render("Listing/paymentPage", {total})
}