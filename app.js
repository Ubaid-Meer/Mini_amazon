const express=require('express')
const path=require('path')
const PORT=8000;
const app=express()

// import file and module

const connectDB = require('./config/db');
const productRoute=require('./routes/productRoutes')


//Connect Database
connectDB();
// Middleware
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('publics'))
//Ejs Setup 
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'));

// use Routes

app.get('/',(req,res)=>{
    res.render('home')
});

app.use('/product',productRoute)


app.listen(PORT,()=>console.log(`Server is started on http://localhost:${PORT}`))
