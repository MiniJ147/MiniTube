const express = require("express");
const router = express.Router();
const mongodb = require('mongodb');

var mongo_util = require('./../mongo_utils');

router.get("/", (req, res)=>{
    res.render('video',{});
});

router.get("/download", async function (req, res) {
    try{
        const range = req.headers.range;
        if(!range){
            res.status(400).send("Requires header range");
            return;
        }

        const db = mongo_util.get_client().db('Videos');
        const file = await db.collection('fs.files').findOne({});

        if(!file){
            res.status(404).send('No Video Found');
            return;
        }
        
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

        const bucket = new mongodb.GridFSBucket(db);
        const download_stream = bucket.openDownloadStreamByName(file.filename,{
            start:start,
            end:end + 1,
        });

        download_stream.pipe(res);
    }catch(err){
        console.log(err);
        res.status(500).send(err);
        return;
    }
});

module.exports = router;