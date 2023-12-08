const express = require("express");
const router = express.Router();
const mongodb = require('mongodb');

var mongo_util = require('../utils/mongo_utils');

router.get("/", async (req, res)=>{
    const file_request = req.query.video_search;
    console.log('File request: '+file_request);

    //empty search query
    if(file_request == ''){
        res.redirect('/');
        return;
    }

    const db = mongo_util.get_client().db('Videos');
    const videos = await db.collection('fs.files').find({filename:file_request}).toArray();

    console.log(videos);

    res.render('video_display',{
        video_list: videos //video query
    });
});

router.get('/watch', async (req,res)=>{
    const channel_id = req.query.channel;
    const video_id = req.query.video;

    console.log(channel_id,video_id);

    const db = mongo_util.get_client().db('Videos');
    const file = await db.collection('fs.files').findOne({},{metadata:{channel_id:channel_id,video_id:video_id}});

    res.render('video',{desc:file.metadata.desc});
})

router.get("/download", async function (req, res) {
    try{
        //finding range
        const range = req.headers.range;
        if(!range){
            res.status(400).send("Requires header range");
            return;
        }

        //fetching request
        const request = req.query;
        console.log('request',request.channel,request.video);

        //finding file in database
        const db = mongo_util.get_client().db('Videos'); // await db.collection('fs.files').findOne({metadata:{channel_id:request.channel,video_id:request.video}});
        const file = await db.collection('fs.files').findOne({},{metadata:{channel_id:request.channel,video_id:request.video}});

        console.log(file);

        //error handling
        if(!file){
            res.status(404).send('No Video Found');
            return;
        }
        
        //setting up video rendering
        const CHUNK_SIZE = (10 ** 6) * 5; //5MB
        const video_size = file.length;
        const start = Number(range.replace(/\D/g, ""));
        const end = video_size - 1;

        const content_length = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${video_size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": content_length,
            "Content-Type": "video/mp4",
        };

        res.writeHead(206,headers);

        //connecting to bucket
        const bucket = new mongodb.GridFSBucket(db);
        const download_stream = bucket.openDownloadStream(file._id,{
            start:start,
            end:end + 1,
        });

        download_stream.pipe(res); //streaming data
    }catch(err){
        console.log(err);
        res.status(500).send(err);
        return;
    }
});

module.exports = router;