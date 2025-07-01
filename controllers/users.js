const User=require("../models/user");

//==============================================================================================
//SIGNUP

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup=async (req,res)=>{
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
};

//==============================================================================================
//  LOGIN

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async(req,res)=>{
    req.flash("success",`Welcome Back! ${req.body.username}`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

//==============================================================================================
//  LOGOUT

module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }else{
            req.flash("success","Logged-Out Successfully!");
            res.redirect("/listings");
        }
    })
};

//==============================================================================================