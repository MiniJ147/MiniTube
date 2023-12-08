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
    const metadata_collection = db.collection('metadata');

    const db_meta_data = await metadata_collection.findOne({});
    
    let video_id = db_meta_data.video_id+1;
    const result = await metadata_collection .updateOne({},
        {
            $set:{video_id:video_id}
        },
        { upsert: false});
    
    video_id = video_id.toString();
    //console.log(result);

    //setting up streams
    const bucket = new mongodb.GridFSBucket(db);
    const video_upload_stream = bucket.openUploadStream(req.body.name,{
        metadata: {channel_id:"XXX" ,video_id:video_id}
    });
    const video_read_stream = fs.createReadStream(file_path+file_name);
    video_read_stream.pipe(video_upload_stream);


    //if video finished remove from server storage
    video_read_stream.on('close',()=>{remove_file(file_path+file_name)});

    res.status(200).json({file_name:file_name,status:"finished"});
})

module.exports = router;