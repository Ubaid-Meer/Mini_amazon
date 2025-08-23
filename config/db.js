const mongoose=require('mongoose')

async function  connectDB(){
try{

    await mongoose.connect('mongodb://127.0.0.1:27017/amazon')
    console.log('Database Connected')
}
catch(err){
    console.error(err.message)
    console.log('Failed Connection')

}
}

module.exports=connectDB;