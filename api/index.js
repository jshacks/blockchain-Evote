const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const nbv = require("./jsbn/jsbn.js").nbv;
const nbi = require("./jsbn/jsbn.js").nbi;
const MongoClient = require('mongodb').MongoClient;
const paillier = require("./jsbn/pailier.js").paillier;
const BigInteger = require("./jsbn/jsbn.js").BigInteger;
const uuidv4 = require('uuid/v4');
var url = 'mongodb://admin:pickwick@ds227045.mlab.com:27045/evote';

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send("hello world")
});

app.get('/credentials', function(req, res) {
  const publicKey = uuidv4();
  const privateKey = uuidv4();

  res.send({
    'publicKey': publicKey,
    'privateKey': privateKey
  })
});

app.post('/encrypt-vote', function(req, res) {
  let vote = req.body.vote;

  let electionId = req.body.electionId;
  const numbits = 256;

  //get keypair
  const keys = paillier.generateKeys(numbits);
  let ks = {
    pub: keys.pub.n.toString(),
    priv: keys.sec.lambda.toString()
  }
  MongoClient.connect(url, function(err, db) {
    // Save keys to database
    var elections = db.collection('elections');
    elections.insert({
      electionId: electionId,
      keys: keys
    }, function(e,r) {
      //search the election and find the maximum number of votes allowed
      if(e) {
        console.log(e);
        return;
      } 
      let maxAllowed = 1;
      

      //encrypting vote
      let choices = [];

      let votes = vote.split('');

      votes.forEach(function(v, idx) {
        choices[idx] = keys.pub.encrypt(nbv(v));
      });

      //now add all cryptos
      let final, finalChoices=[];
      choices.forEach(function(c) {
        finalChoices.push(c.toString())
        if(!final) {
          final = c;
          return;
        }
        final = keys.pub.add(final,c);
      });

      let result = finalChoices;

      res.send({result});
    });
  });
  
});

app.post('/decrypt-tally', function(req, res) {
  let vote = req.body.vote;
  let electionId = req.body.electionId;
  let v = new BigInteger(vote,10);
  
  MongoClient.connect(url, function(err, db) {
    // Save keys to database
    if(err) (console.log(err))
    var elections = db.collection('elections');
    let election = elections.findOne({
      electionId: electionId
    }, function(e,r) {
      if(!r) res.send("Inexistent election")
      console.log(JSON.stringify(r.keys))
      let keys = r.keys;
      keys.pub.__proto__ = paillier.publicKey.prototype;
      
      keys.pub.n.__proto__ = BigInteger.prototype;
      keys.pub.n2.__proto__ = BigInteger.prototype;
      keys.pub.np1.__proto__ = BigInteger.prototype;

      keys.sec.__proto__ = paillier.privateKey.prototype;
      keys.sec.x.__proto__ = BigInteger.prototype;
      keys.sec.lambda.__proto__ = BigInteger.prototype;
      keys.sec.pubkey = keys.pub;

      v.__proto__ = BigInteger.prototype;

      let decrypted = keys.sec.decrypt(v).toString(10);
  
      res.send({
        result: decrypted
      });
    });
  });
});

app.get('/tally/:electionId/show-tally', function(req, res) {
  // res.send("Sorry election not over yet");  

  let electionId = req.params.electionId;

  MongoClient.connect(url, function(err, db) {
    // Save keys to database
    if(err) (console.log(err))
    var elections = db.collection('elections');
    let election = elections.findOne({
      electionId: electionId
    }, function(e,r) {
      if(!r) res.send("Inexistent election")

      res.send({
        result: election ? election.tally : []
      });
    });
  });

});

app.get('/tally/:electionId/show-private-key', function(req, res) {
  // res.send("Sorry election not over yet");  

  let electionId = req.params.electionId;
  
  MongoClient.connect(url, function(err, db) {
    // Save keys to database
    if(err) (console.log(err))
    var elections = db.collection('elections');
    let election = elections.findOne({
      electionId: electionId
    }, function(e,r) {
      if(!r) res.send("Inexistent election")
      console.log(JSON.stringify(r.keys))
      let keys = r.keys;

      keys.pub.__proto__ = paillier.publicKey.prototype;
      
      keys.pub.n.__proto__ = BigInteger.prototype;
      keys.pub.n2.__proto__ = BigInteger.prototype;
      keys.pub.np1.__proto__ = BigInteger.prototype;

      keys.sec.__proto__ = paillier.privateKey.prototype;
      keys.sec.x.__proto__ = BigInteger.prototype;
      keys.sec.lambda.__proto__ = BigInteger.prototype;
      keys.sec.pubkey = keys.pub;
  
      res.send({
        result: {
          pub: keys.pub.n.toString(),
          priv: keys.sec.lambda.toString() 
        }
      });
    });
  });
    
});

app.get('/tally/:electionId/show-allowed-address-list', function(req, res) {
   // res.send("Sorry election not over yet");  

  let electionId = req.params.electionId;
   
  MongoClient.connect(url, function(err, db) {
    if(err) (console.log(err))
    var elections = db.collection('elections');
    let election = elections.findOne({
      electionId: electionId
    }, function(e,r) {
      if(!r) res.send("Inexistent election")

      res.send({
        result: election ? election.allowedAddresses : []        
      });
    });
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});