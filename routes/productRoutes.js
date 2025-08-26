const express=require('express')
const router=express.Router()
const Product=require('../models/product')
const isauth=require('../middleware/isauth');


//Show all Product

router.get('/all',async(req,res)=>{
    try{
        const products =await Product.find();
        res.render('products/list',{title:"All Product",products})
    }
    catch(err){
        console.error(err)
        res.status(500).send('Server Error ')
    }
})

router.get("/add", isauth,(req, res) => {
  res.render("products/add", { title: "Add Product" });  // ✅ corrected path
});

// Handle Add Product
router.post("/add", isauth,async (req, res) => {
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
    res.redirect("/products/all");  // ✅ corrected redirect
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add Product: " + err.message);
  }
});

router.get('/edit/:id',isauth,async(req,res)=>{
  try{
    const product=await Product.findById(req.params.id);
    if(!product) return res.status(404).send('Product Not found');

    res.render('products/edit',{title:"Edit   Product",product})
  }
  catch(err){
    console.error(err)
    res.status(500).send("Server Error")
  }
});
router.post('/edit/:id',isauth,async(req,req)=>{

  try {
      const {name,price ,description}=req.body;
      await Product.findByIdAndUpdate(req.params.id,{
        name,price,description

      });
      res.redirect('/products/all')


  } catch (error) {
    console.error(err)
    res.status(500).send('Server Error')
    
  }
})
module.exports=router;

