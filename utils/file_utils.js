const multer = require('multer');
const fs = require('fs');
const path = require('path')
const LOG = require('./logger');

var file_queue = [];

//saving files
const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,'uploads/');
    },
    filename: (req,file,cb)=>{
        let file_name = req.body.name + '.mp4';
        
        //checks for duplicates
        while(fs.existsSync(path.join(__dirname,'../uploads/'+file_name))){
            file_name = req.body.name+ Math.abs(Math.random()*100)+'.mp4'; //generate random name
            LOG('file_utils','new file name: '+file_name,0);
        }

        file_queue.push(file_name);
        LOG('file_utils',file_queue);
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

module.exports = {upload:upload,remove_file:remove_file,get_queue:function(){return file_queue}};