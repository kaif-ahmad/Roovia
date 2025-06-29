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