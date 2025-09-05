const multer=require('multer')
const path=require('path')


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/images");

    },
    filename:function(req,file,cb){
        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );

    },

});


const fileFilter=(req,file,cb)=>{
        const allowTypes=/jpg|jpeg|png|gif/
        const ext=path.extname(file.originalname).toLowerCase();
        if(allowTypes.test(ext)){
                cb(null,true);

        }else{
            cb(new Error("only Image allowed"),false)
        }

};

const upload=multer({storage,fileFilter});


module.exports=upload