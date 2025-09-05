const express = require("express");
const router = express.Router();

const isauth = require("../middleware/isauth");
const Cart = require("../models/cart");

router.post("/add/:id", isauth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.session.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.session.user._id, items: [] });
    }
    const productIndex = cart.items.findIndex(
      (item) => item.productId == req.params.id
    );
    if (productIndex > -1) {
      cart.items[productIndex].quantity += 1;
    } else {
      cart.items.push({ productId: req.params.id, quantity: 1 });
    }
    await cart.save();
    res.redirect("/cart");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error Adding item to Cart");
  }
});
router.get("/", async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.session.user._id }).populate(
      "items.productId"
    );

    if (!cart) {
      // If user has no cart, pass an empty array instead of undefined
      return res.render("cart/index", { cart: { items: [] } });
    }

    res.render("cart/index", { cart });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching cart");
  }
});

router.post("/update/:productId", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    const { productId } = req.params;
    const { quantity } = req.body;

    let cart = await Cart.findOne({ userId: req.session.user._id });

    if (!cart) {
      return res.redirect("/cart");
    }
    const item = cart.items.find((i) => {
      const id = i.productId._id
        ? i.productId._id.toString()
        : i.productId.toString();
      return id === productId;
    });
    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => {
        const id = i.productId._id
          ? i.productId._id.toString()
          : i.productId.toString();
        return id !== productId;
      });
    } else {
      item.quantity = parseInt(quantity, 10);
    }
    res.redirect("/cart");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error Updating Item");
  }
});

router.post("/remove/:productId", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    const { productId } = req.params;
    let cart = await Cart.findOne({ userId: req.session.user._id });

    if (!cart) return res.redirect("/cart");

    cart.items = cart.items.filter((i) => {
      const id = i.productId._id
        ? i.productId._id.toString()
        : i.productId.toString();
      return id !== productId;
    });

    await cart.save();
    res.redirect("/cart");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error removing item");
  }
});
module.exports = router;
