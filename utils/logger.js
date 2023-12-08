const dotenv = require('dotenv');

dotenv.config();

const FLAG = process.env.DEBUG_FLAG;
var LOG = function(msg) {return};

if(FLAG==1){
    console.log("=============================\n|CURRENTLY INSIDE DEBUG MODE|\n=============================");
    
    LOG = function(file_name,msg,active=1){
        if(active==0) return;

        //parsing file name
        for(let i=file_name.length-1; i>=0;i--){
            if(file_name[i]=='\\'){
                file_name = file_name.slice(i+1);
                break;
            }
        }

        console.log(`File: ${file_name} | LOG: `,msg);
    }
}

module.exports = LOG;
