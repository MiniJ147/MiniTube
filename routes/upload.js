const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');

router.get('/',async (req,res)=>{
    const result = req.query.result;
    res.render('upload',{
        result:result
    });
})

router.post('/post', async (req,res)=>{
    console.log(`Video Name: ${req.body.video_name}\nDesc: ${req.body.video_desc}\nFile: ${req.body.video_file}`);
    res.redirect('/upload?result=success');
})

module.exports = router;