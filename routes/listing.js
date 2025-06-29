const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing}=require("../middleware.js");

//============================================================================
//  Index Route

router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//============================================================================
//  Add New Route

//  Details
router.get("/new",isLoggedIn,(req,res)=>{
    return res.render("listings/new.ejs");
})
//  Adding on DB using POST
router.post("/",isLoggedIn,validateListing,wrapAsync(async (req,res)=>{
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","Hotel Added!");
    res.redirect("/listings");
}))

//============================================================================
//  Show Route

router.get("/:id", wrapAsync(async (req, res) => {
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path: "reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Hotel Does Not Exist!");
        return res.redirect("/listings");
    }
    return res.render("listings/show.ejs",{listing});
}));

//============================================================================
//  Edit Route

//  Details
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Hotel Does Not Exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}))

//  Editing on DB using POST
router.put("/:id",validateListing,isOwner,wrapAsync(async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send Valid Data!");
    }
    console.log(req.body.listing,req.params);
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Hotel Details Updated!");
    res.redirect(`/listings/${id}`);
}))

//============================================================================
//  Delete Route

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req, res) => {
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("error","Hotel Deleted!");
    res.redirect("/listings");
}));

//============================================================================

module.exports=router;