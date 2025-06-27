const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const session=require("express-session");
const flash=require("connect-flash");

const listing=require("./routes/listing.js");
const review=require("./routes/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const sessionOptions={
    secret: "mysupersecreatcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000, // Expires in 1 Week 
        maxAge: 7*24*60*60*1000,
        httpOnly: true,

    }
};
//===========================================================================
//  Mongoose Connection

const MONGO_URL = 'mongodb://127.0.0.1:27017/roovia';
main().then(res => { console.log("CONNECTED TO DB") }).catch(err => { console.log(err) });
async function main() {
    await mongoose.connect(MONGO_URL);
}
//===========================================================================
//  Root Route

app.get("/", (req, res) => {
    res.send("ROOT Working");
})

//============================================================================

app.use(session(sessionOptions));
app.use(flash());

//============================================================================

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    console.log(res.locals.success);
    next();
})

//============================================================================
// Routes

app.use("/listings",listing);
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

app.listen(8080, () => {
    console.log("Server Listening on PORT 8080");
})

//============================================================================