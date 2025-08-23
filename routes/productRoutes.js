const express=require('express')
const router=express.Router()
const Product=require('../models/product')

//Show all Product

router.get('/product',async(req,res)=>{
    try{
        const product =await Product.find();
        res.render('products/list',{title:"All Product",product})
    }
    catch(err){
        console.error(err)
        res.status(500).send('Server Error ')
    }
})

router.get('/add',(req,res)=>{
    res.render('product/add',{title:"Add Product"})
});
router.post("/add",async(req,res)=>{
    try{
        const{name,price,descripion,category,stock}=req.body;
        await Product.create({
            name,
            price,
            descripion,
            category,
            stock,
            image:"default.jpg"
        });
        res.redirect('/products')   
    }catch(err){
        console.error(err)
        res.status(500).send("Failed to add Product",err.message)
    }
})

module.exports=router;

