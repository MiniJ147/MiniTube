const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');

router.get('/',async (req,res)=>{
    res.render('homepage',{});
})

module.exports = router;