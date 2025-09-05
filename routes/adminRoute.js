const express = require('express')
const router = express.Router()
const Order = require("../models/Order");
const { isAdmin } = require('../middleware/auth')






router.get('/orders', isAdmin, async (req, res) => {
    try {
        const orders = await Order.find().populate("userId").populate("items.productId")
        res.render('admin/orders', { orders })

    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading orders");

    }
});


router.post('/orders/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await Order.findByIdAndUpdate(id, { status })
        res.redirect('/admin/orders')
    } catch (error) {
        console.error(err);
        res.status(500).send("Error loading orders");
    }
});

module.exports = router;
