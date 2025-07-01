const Review=require("../models/reviews.js");
const Listing=require("../models/listing.js");

module.exports.postReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    newReview.author=req.user._id;  //Storing Review's Author

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("New Review Saved");
    req.flash("success","Review Added!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}}); // Jo bhi reviews array me reviewId match krega wo remove/pull krdega
    await Review.findByIdAndDelete(reviewId);

    req.flash("error","Review Deleted!");
    res.redirect(`/listings/${id}`)
};