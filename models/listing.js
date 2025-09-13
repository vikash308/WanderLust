const mongoose = require("mongoose");
const Review = require("./review")

const listingSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default:"https://unsplash.com/photos/palm-trees-and-mountains-under-a-blue-sky-sjvjzoCizjQ",
        set: (v) => v==="" ? "https://unsplash.com/photos/palm-trees-and-mountains-under-a-blue-sky-sjvjzoCizjQ": v
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})

listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in: listing.reviews}})
    }
} )

const Listing = mongoose.model("Listing",listingSchema)
module.exports = Listing;