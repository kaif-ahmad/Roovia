const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");

//============================================================================
//  POST REVIEW ROUTE

router.post("/", isLoggedIn, validateReview, wrapAsync (async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    newReview.author=req.user._id;  //Storing Review's Author

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("New Review Saved");
    req.flash("success","Review Added!");
    res.redirect(`/listings/${listing._id}`);
}))

//  DELETE REVIEW ROUTE
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync( async(req,res)=>{
    let {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}}); // Jo bhi reviews array me reviewId match krega wo remove/pull krdega
    await Review.findByIdAndDelete(reviewId);

    req.flash("error","Review Deleted!");
    res.redirect(`/listings/${id}`)
}))

//============================================================================

module.exports=router;