const express=require('express')
const bcrypt=require('bcryptjs')
const router=express.Router()

const User=require('../models/User')



// Register Router

router.get('/register',(req,res)=>{
    res.render('auth/register',{title:"Register"})

});

// Handle Register Form

router.post('/register',async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        

        let user=await  User.findOne([email]);
        if(user){
            return  res.send("User Already Exist")

        }
        const hashedPassword=await bcrypt.hash(password,10)//10 Salt Round

        user=new User({username,email,password:hashedPassword});
        await user.save();
        //Redirect to login

        res.redirect('auth/login')

    }
    catch(err){
        console.error(err)
        res.status(500).send("Server Error")
    }
});

router.get('/login',(req,res)=>{
    res.render('auth/login',{title:"Login Page"})

});


router.post('/login',async(req,res)=>{

    try{

        
        const {email,password}=req.body;
        
        const user=await User.findOne({email})
        
        if(!user) return res.send('Invalid User ,Please Check you Email and password')
            
            const isMatch=await bcrypt.compare(password, user.password)
            if(!isMatch) return res.send('Invalid  email and Passord')
                req.session.user=user;
            
            res.redirect('/products/all');
        }
        catch(err){
            console.error(err)
            res.status(500).send("server error")
        }

})


