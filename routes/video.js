const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

router.get('/', async(req,res)=>{
    res.render('video',{});
})

router.get('/play', async(req,res)=>{
    const range = req.headers.range;
    if(!range){
        res.status(400).send('Requires Range Header');
        return;
    }

    const video_path = path.join(__dirname,'../test/video.mp4');
    const video_size = fs.statSync(video_path).size;

    const CHUNK_SIZE = (10 ** 6) * 5; //5MB
    const start = Number(range.replace(/\D/g,""));
    const end = Math.min(start + CHUNK_SIZE, video_size - 1);

    const content_length = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${video_size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": content_length,
        "Content-Type": "video/mp4"
    };

    res.writeHead(206,headers);

    const video_stream = fs.createReadStream(video_path,{start,end});

    video_stream.pipe(res);
})

module.exports = router;