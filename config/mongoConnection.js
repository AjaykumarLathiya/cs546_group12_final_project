const { MongoClient } = require('mongodb');
const settings = require('./settings');
const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

async function connectMongo() {
  try {

    if (!_connection) {
      _connection = await MongoClient.connect(mongoConfig.serverUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      _db = await _connection.db(mongoConfig.database);
    }

    global._connection = _connection;
    global._db = _db;

    return _db;
  }
  catch (ex) {
    console.log(ex);
    return undefined
  }
}


module.exports = {
  connectMongo
}