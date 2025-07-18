const mongoose = require("mongoose");
const initData = require("./data.js"); //object of array ie data { data[{},{}...] }
const Listing = require("../models/listing.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/roovia';
main().then(res => { console.log("CONNECTED TO DB") }).catch(err => { console.log(err) });
async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"68602b6cbfec798a2c48f392"}))
    await Listing.insertMany(initData.data);
    console.log("Data was Initialised");
}

initDB();