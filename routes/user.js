const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/users.js");

//======================================================================
//  SIGN-UP

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

//======================================================================
//  LOG-IN

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(userController.login));

//======================================================================
//  LOG-OUT

router.get("/logout",userController.logout);

//======================================================================

module.exports=router;
