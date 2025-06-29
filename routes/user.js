const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

//======================================================================
//  SIGN-UP

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup",wrapAsync(async (req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registereduser=await User.register(newUser,password);
        console.log(registereduser);
        req.login(registereduser,(err)=>{
            if(err) return next(err);
            else{
                req.flash("success",`Welcome To Roovia ${username}`);
            return res.redirect("/listings");
            }
        })
    }catch(e){
        req.flash("error",e.message);
        return res.redirect("/signup");
    }
}));

//======================================================================
//  LOG-IN

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(async(req,res)=>{
    req.flash("success",`Welcome Back! ${req.body.username}`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}));

//======================================================================
//  LOG-OUT

router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }else{
            req.flash("success","Logged-Out Successfully!");
            res.redirect("/listings");
        }
    })
});

//======================================================================

module.exports=router;
