const express = require("express");
const fs = require('fs');
const mongodb = require('mongodb');
const {upload,remove_file} = require('../utils/file_utils');
const router = express.Router();
const path = require('path'); 

var mongo_util = require('../utils/mongo_utils');

router.get('/',async (req,res)=>{
    res.render('upload',{});
})

router.post('/submit', upload.single('file'), async (req,res)=>{
    const file_name = req.body.name+'.mp4';
    console.log(file_name);

    const file_path = path.join(__dirname,'../uploads/');

    const db = mongo_util.get_client().db('Videos');
    
    //setting up streams
    const bucket = new mongodb.GridFSBucket(db);
    const video_upload_stream = bucket.openUploadStream(req.body.name);
    const video_read_stream = fs.createReadStream(file_path+file_name);
    video_read_stream.pipe(video_upload_stream);


    //if video finished remove from server storage
    video_read_stream.on('close',()=>{remove_file(file_path+file_name)});

    res.status(200).json({file_name:file_name,status:"finished"});
})

module.exports = router;