module.exports=(req,res,next)=>{
 if(req.session.user){
    return next();

 }
//  if not login redirect to login page
res.redirect('/auth/login')
}