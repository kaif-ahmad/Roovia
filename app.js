const express = require("express");
const app = express();
const mongoose = require("mongoose");
//============================================================================
//  Mongoose Connection

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
main().then(res => { console.log("CONNECTED TO DB") }).catch(err => { console.log(err) });
async function main() {
    await mongoose.connect(MONGO_URL);
}

//============================================================================



//============================================================================
//  Root Route

app.get("/", (req, res) => {
    res.send("ROOT Working");
})

//============================================================================

app.listen(8080, () => {
    console.log("Server Listening on PORT 8080");
})

//============================================================================