const express = require("express");
const path = require("path");
const PORT = 8000;
const app = express();
const session = require("express-session");
const flash = require("connect-flash");

// import file and module

const connectDB = require("./config/db");
const productRoute = require("./routes/productRoutes");
const authRoute = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoute = require("./routes/orderRoute");
const adminRoute = require("./routes/adminRoute");

//Connect Database
connectDB();
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// session setup
app.use(
  session({
    secret: "mini-amazon-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// app.use(flash());
// app.use((req,res,next)=>{
//     res.locals.success_msg=req.flash('success_msg')
//     res.locals.error_msg=req.flash('error_msg')
//     next();

// })
//Ejs Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// use Routes

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/products", productRoute);
app.use("/auth", authRoute);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoute);
app.use("/admin", adminRoute);

app.listen(PORT, () =>
  console.log(`Server is started on http://localhost:${PORT}`)
);
