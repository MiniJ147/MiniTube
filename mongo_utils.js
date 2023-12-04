const MongoClient = require( 'mongodb' ).MongoClient;
const dotenv = require('dotenv');

dotenv.config();

const url = `mongodb+srv://jakepaul:${process.env.APIKEY}@cluster0.v4uvfyk.mongodb.net/?retryWrites=true&w=majority`;

var _client;

module.exports = {
    connectToServer: async function() {
      await MongoClient.connect( url, {}).then(client=>{
        console.log('connection sucessful');
        _client = client;
      }).catch(err=>{
        console.log(err);
        _client = 0;
      });
    },
    
    get_client: function(){
        return _client;
    }
};