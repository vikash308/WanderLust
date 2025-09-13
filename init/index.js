const mongoose = require("mongoose");
const data = require("./data.js")
const Listing = require("../models/listing.js")

main().then(()=>{
    console.log("connected")
}).catch((err)=>{
    console.log(err)
})

async function main(){
    mongoose.connect("mongodb://localhost:27017/wonderlust")
}

const initData = async()=>{
    console.log(data)
    await Listing.deleteMany({});
    await Listing.insertMany(data.data)
}

initData();

