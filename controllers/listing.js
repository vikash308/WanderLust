const Listing = require("../models/listing")


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
  res.render("Listing/edit", { listing });
}

module.exports.addNewListing = async (req, res, next) => {
  console.log(req.body.listing)
  const list = new Listing(req.body.listing);
  list.owner = req.user._id;
  await list.save();
  req.flash("success", "New Listing Created")
  res.redirect("/listing");
}

module.exports.editListing = async (req, res, next) => {
  let id = req.params.id;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "listing has been updated")
  res.redirect("/listing");
}

module.exports.deleteListing = async (req, res) => {
  let id = req.params.id;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "listing has been deleted")
  res.redirect("/listing");
}