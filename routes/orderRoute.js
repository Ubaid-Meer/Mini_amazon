const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const Order = require("../models/Order");

router.post("/checkout", async (req, res) => {
  try {
    if (!req.session.user) {
      console.log("❌ No user in session");
      return res.render("auth/login");
    }

    const cart = await Cart.findOne({ userId: req.session.user._id }).populate(
      "items.productId"
    );
    if (!cart || cart.items.length === 0) {
      console.log("❌ Cart not found for user:", req.session.user._id);
      return res.redirect("/cart");
    }
    // if (cart.items.length === 0) {
    //     console.log("❌ Cart is empty for user:", req.session.user._id);
    //     return res.redirect("/cart");
    // }
    // console.log("✅ Cart found:", cart);
    const paymentMethod = req.body.paymentMethod || "COD";

    // Create new order
    const newOrder = new Order({
      userId: req.session.user._id,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      })),
      totalPrice: cart.items.reduce(
        (sum, item) => sum + item.productId.price * item.quantity,
        0
      ),
      paymentMethod,
      createdAt: new Date(),
      status: "Pending",
    });

    await newOrder.save();
    console.log("✅ Order saved:", newOrder);

    // Clear cart
    cart.items = [];
    await cart.save();
    console.log("✅ Cart cleared");

    res.redirect("/orders/history");
  } catch (error) {
    console.error("❌ Checkout Error:", error.message);
    res.status(500).send("Checkout failed: " + error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    let cart = await Cart.findOne({ userId: req.session.user._id }).populate(
      "items.productId"
    );

    if (!cart) {
      // create empty cart object if user has no cart
      cart = { items: [] };
    }

    res.render("cart/checkout", { cart });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading cart");
  }
});

router.get("/history", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("auth/login");
    }
    const orders = await Order.find({ userId: req.session.user._id })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    return res.render("order/history", { orders });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to load order history");
  }
});

module.exports = router;
