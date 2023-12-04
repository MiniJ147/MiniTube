const express = require('express');
const app = express();
const dotenv = require('dotenv');
const body_parser = require('body-parser');

var mongo_util = require('./mongo_utils');

dotenv.config();

const PORT = process.env.PORT;

app.set('view engine','ejs');

app.use(express.static("public"));
app.use(body_parser.urlencoded({extended:true}));

mongo_util.connect_to_server();

const root_route = require('./routes/root');
app.use('/',root_route);

const upload_route = require('./routes/upload');
app.use('/upload',upload_route);

const video_route = require('./routes/video');
app.use('/video',video_route);

app.listen(PORT,()=>{
    console.log(`Starting Server on port ${PORT}`);
    console.log(`http://localhost:${PORT}/`);
})