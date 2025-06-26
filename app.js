const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

const listing=require("./routes/listing.js");
const review=require("./routes/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));

//  Mongoose Connection

const MONGO_URL = 'mongodb://127.0.0.1:27017/roovia';
main().then(res => { console.log("CONNECTED TO DB") }).catch(err => { console.log(err) });
async function main() {
    await mongoose.connect(MONGO_URL);
}
//============================================================================
// Listings

app.use("/listings",listing);

//============================================================================
//  Reviews

app.use("/listings/:id/reviews",review);

//============================================================================
//  ERRORS

// app.all("*",(req,res,next)=>{
//     return next(new ExpressError(404,"Page Not Found!"));
// })

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong!"}=err;
    res.status(statusCode).render("error.ejs",{err});
    //res.status(statusCode).send(message);
})

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