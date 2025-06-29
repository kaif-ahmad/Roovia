const Listing=require("./models/listing");
const Review=require("./models/reviews");
const ExpressError=require("./utils/ExpressError");
const {listingSchema,reviewSchema}=require("./schema");

module.exports.isLoggedIn = (req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;    //Agr koi user signup na kiya ho to usko login signup karane ke baad wahi page pe laane ke liye
        req.flash("error","Please Login/Signup");
        return res.redirect("/login");
    }
    return next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    return next();
}

module.exports.isOwner=async(req,res,next)=>{   //FOR Listings
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){    //Koi bhr se na update krde
        req.flash("error","You Dont Own Thie Post!");
        return res.redirect(`/listings/${id}`);
    }
    return next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{   //FOR Reviews
    let {id,reviewId}=req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){    //Koi bhr se na update krde
        req.flash("error","This Review Was Not Posted By You!");
        return res.redirect(`/listings/${id}`);
    }
    return next();
}

//============================================================================
//  Validation

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

//============================================================================