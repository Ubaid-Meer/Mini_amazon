const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // make sure User model exists
const isauth=require('../middleware/isauth')

// Register POST
router.get('/register',(req,res)=>{
    res.render('auth/register',{title:"Registeration Form"})
})
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // check if email already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.send("User Already Exist");
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new user
        user = new User({ username, email, password: hashedPassword });
        await user.save();

        // redirect to login page
        res.redirect('/auth/login');

    } catch (err) {
        console.error("Register Error:", err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;


router.get('/login',(req,res)=>{
    res.render('auth/login',{title:"Login Page"})

});


router.post('/login',async(req,res)=>{

    try{

        
        const {email,password}=req.body;
        
        const user=await User.findOne({email})
        
        if(!user){
            //  return res.send('Invalid User ,Please Check you Email and password')
            // req.flash('error_msg','Invalid Email and Password')
        }
            
            const isMatch=await bcrypt.compare(password, user.password)
            if(!isMatch) return res.send('Invalid  email and Passord')
                //  req.flash('error_msg','Invalid Email and Password')

                req.session.user=user;
            // console.log("user Session ",req.session)
            
            res.redirect('/products/all');
        }
        catch(err){
            console.error(err)
            res.status(500).send("server error")
        }

});

router.get('/logout',isauth,(req,res)=>{
    req.session.destroy(err=>{
        if(err){
            console.error(err)
            return res.status(500).end("Server Error to logout")
        }
        // clear Cookie and delete user session data
        res.clearCookie('connect.sid')
        // res.flash('success_msg','Successfully log out! ')
        res.redirect('/products/all')
    })
})
module.exports=router

