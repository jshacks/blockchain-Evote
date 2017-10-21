var MongoClient = require('mongodb').MongoClient
var assert = require('assert')

// Connection URL, you have the database name in the URL
var databaseName = 'election'
var url = 'mongodb://localhost:27017/' + databaseName

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err)
  console.log('Connected successfully to server')

  // To insert a record do:
  // db.collection('voting').insertOne(
  //   {elid: "elid", pkCrypto: "pk", tallyRez: "1", endDate: "endOfTime", listOfIds: [{hash: "000", used: true}]}
  // )

  db.close()
});
