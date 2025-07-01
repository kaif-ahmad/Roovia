const Listing=require("../models/listing.js");

//===============================================================================================================================
//  Index

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

//===============================================================================================================================
//  Add New 

module.exports.renderNewForm=(req,res)=>{
    return res.render("listings/new.ejs");
};

module.exports.createListing=async (req,res)=>{
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    let url=req.file.path;
    let filename=req.file.filename;
    newListing.image={url,filename};
    await newListing.save();

    req.flash("success","Hotel Added!");
    res.redirect("/listings");
};

//===============================================================================================================================
//  Show

module.exports.showListings=async (req, res) => {
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path: "reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Hotel Does Not Exist!");
        return res.redirect("/listings");
    }
    return res.render("listings/show.ejs",{listing});
};

//===============================================================================================================================
//  Edit 

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Hotel Does Not Exist!");
        return res.redirect("/listings");
    }   
    //To Decrease Pixels of Image For Previewing 
    let originalImage=listing.image.url;
    originalImage = originalImage.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImage});
};

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }

    req.flash("success","Hotel Details Updated!");
    res.redirect(`/listings/${id}`);
}

//===============================================================================================================================
//  Delete

module.exports.destroyListing=async (req, res) => {
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("error","Hotel Deleted!");
    res.redirect("/listings");
};

//===============================================================================================================================