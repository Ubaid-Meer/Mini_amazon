const express=require('express')
const path=require('path')
const PORT=8000;
const app=express()
const session=require('express-session')

// import file and module

const connectDB = require('./config/db');
const productRoute=require('./routes/productRoutes')


//Connect Database
connectDB();
// Middleware
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('publics'))
app.use(session({
    secret:'mini-amazon-secret',
    resave:false,
    saveUninitialized:false
}))
//Ejs Setup 
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'));

// use Routes

app.get('/',(req,res)=>{
    res.render('/products/all')
});

app.use('/products',productRoute)


app.listen(PORT,()=>console.log(`Server is started on http://localhost:${PORT}`))
