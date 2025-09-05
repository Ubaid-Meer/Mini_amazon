const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const isauth = require("../middleware/isauth");
const upload = require("../middleware/uploads");

//Show all Product

router.get("/all", async (req, res) => {
  try {
    let perPage = 5;
    let page = parseInt(req.query.page) || 1;

    // Query for search
    let query = {};
    let search = req.query.search;
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ],
      };
    }
    // Sorting Method
    let sortOption = {};
    let sort = req.query.sort;
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "newest") sortOption = { createdAt: -1 };

    // count with search Filter
    let totalProducts = await Product.countDocuments(query);
    // Fint Product with Pagination
    // let products=await Product.find(query)
    const products = await Product.find(query)
      // sort query
      .sort(sortOption)
      // pagination query
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.render("products/list", {
      products,
      search,
      sort,
      user: req.session.user,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / perPage),
    });
  } catch (error) {
    console.error(err);
    res.status(500).send("Failed to Fetch Pro");
  }
});
/* try{
     const products =await Product.find(); 
     res.render('products/list',{products,user:req.session.user})
 }
 catch(err){
     console.error(err)
     res.status(500).send('Server Error ')
 }
})

*/
router.get("/add", isauth, (req, res) => {
  res.render("products/add", { title: "Add Product" }); // ✅ corrected path
});

// Handle Add Product
router.post("/add", isauth, upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, category, stock } = req.body; // ✅ fixed typo
    const product = new Product({
      name,
      price,
      description,
      category,
      stock,
      image: req.file ? req.file.filename : "default.jpg",
      userId: req.session.user._id,
    });
    await product.save();

    res.redirect("/products/all"); // ✅ corrected redirect
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add Product: " + err.message);
  }
});

router.get("/edit/:id", isauth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product Not found");

    res.render("products/edit", { title: "Edit   Product", product });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
router.post("/edit/:id", isauth, async (req, res) => {
  try {
    const { name, price, description } = req.body;
    await Product.findByIdAndUpdate(req.params.id, {
      name,
      price,
      description,
    });
    res.redirect("/products/all");
  } catch (error) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.post("/delete/:id", isauth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/products/all");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error Please try Later");
  }
});
module.exports = router;
