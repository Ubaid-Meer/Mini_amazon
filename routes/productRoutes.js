const express=require('express')
const router=express.Router()
const Product=require('../models/product')

//Show all Product

router.get('/',async(req,res)=>{
    try{
        const products =await Product.find();
        res.render('products/list',{title:"All Product",products})
    }
    catch(err){
        console.error(err)
        res.status(500).send('Server Error ')
    }
})

router.get("/add", (req, res) => {
  res.render("products/add", { title: "Add Product" });  // ✅ corrected path
});

// Handle Add Product
router.post("/add", async (req, res) => {
  try {
    const { name, price, description, category, stock } = req.body; // ✅ fixed typo
    await Product.create({
      name,
      price,
      description,
      category,
      stock,
      image: "default.jpg"
    });
    res.redirect("/products");  // ✅ corrected redirect
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add Product: " + err.message);
  }
});

//Show all Product

// router.get('/all',async(req,res)=>{
//     try{
//         const products =await Product.find();
//         res.render('products/list',{title:"All Product",products})
//     }
//     catch(err){
//         console.error(err)
//         res.status(500).send('Server Error ')
//     }
// })


module.exports=router;

