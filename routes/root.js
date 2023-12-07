const express = require("express");
const router = express.Router();
const mongo_util = require('../utils/mongo_utils');

router.get('/',async (req,res)=>{
    const db = mongo_util.get_client().db('Videos');
    const list =  await db.collection('fs.files').find().toArray();
    
    res.render('homepage',{video_list:list});
})

module.exports = router;