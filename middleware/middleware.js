const mongo_util = require('../utils/mongo_utils');

//might add to all routers 
//for now just leave for root to fix the run.bat error

const check_connection = async function(req,res,next){
    if(!mongo_util.get_connection()){
        await setTimeout(()=>res.redirect('/'),1000);
        return;
    }else{
        next();
    }
}

module.exports = check_connection;