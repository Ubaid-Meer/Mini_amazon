function isLoggedIn(req,res,next){
    if(!req.session.user){
        res.redirect('/login')
    }
    next();

}
function isAdmin(req,res,next){
    if(!req.session.user || req.session.user.role !=="admin"){
        return res.status(403).send("Access Denied :Admin Only")

    }
    next();

}


module.exports={isLoggedIn,isAdmin}