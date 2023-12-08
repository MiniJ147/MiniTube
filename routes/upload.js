const express = require("express");
const fs = require('fs');
const mongodb = require('mongodb');
const file_utils = require('../utils/file_utils');
const router = express.Router();
const path = require('path'); 


var LOG = require('../utils/logger');
var mongo_util = require('../utils/mongo_utils');

router.get('/',async (req,res)=>{
    res.render('upload',{});
}); 

router.post('/submit', file_utils.upload.single('file'),async (req,res)=>{
    const title = req.body.name;

    const file_name = file_utils.get_queue().shift();
    LOG(__filename,file_name);

    //absolute file path
    const file_path = path.join(__dirname,'../uploads/'+file_name);

    const db = mongo_util.get_client().db('Videos');
    const metadata_collection = db.collection('metadata');

    const db_meta_data = await metadata_collection.findOne({});
    
    //updating video_id tracker
    let video_id = db_meta_data.video_id+1;
    const result = await metadata_collection .updateOne({},
        {
            $set:{video_id:video_id}
        },
        { upsert: false});
    
    video_id = video_id.toString();
    LOG(__filename,result);

    //setting up streams
    const bucket = new mongodb.GridFSBucket(db);
    const video_upload_stream = bucket.openUploadStream(title,{
        metadata: {channel_id:"XXX" ,video_id:video_id, desc:req.body.desc}
    });
    const video_read_stream = fs.createReadStream(file_path);
    video_read_stream.pipe(video_upload_stream);


    //if video finished remove from server storage
    video_read_stream.on('close',()=>{file_utils.remove_file(file_path)});

    res.status(200).json({file_name:file_name,status:"finished"});
})

module.exports = router;