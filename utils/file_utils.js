const multer = require('multer');
const fs = require('fs');

//saving files
const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,'uploads/');
    },
    filename: (req,file,cb)=>{
        const file_name = req.body.name + '.mp4';
        cb(null, file_name);
    }
})

//removing a file
function remove_file(file_path){
    fs.unlink(file_path,(err)=>{
        if(err) 
            return console.log(err);
        console.log('file removed');
    })
};

const upload = multer({storage:storage})

module.exports = {upload,remove_file};