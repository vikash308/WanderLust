const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose")


const schema =  new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
})

schema.plugin(passportLocalMongoose);

const User = mongoose.model("User", schema);
module.exports = User;
