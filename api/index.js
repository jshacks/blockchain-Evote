const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const nbv = require("./jsbn/jsbn.js").nbv;

const paillier = require("./jsbn/pailier.js").paillier;

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send("hello world")
});

app.post('/encrypt-vote', function(req, res) {
  let vote = req.body.vote;

  let electionId = req.body.electionId;
  const numbits = 256;

  //get keypair
  const keys = paillier.generateKeys(numbits);


  //search the election and find the maximum number of votes allowed

  let maxAllowed = 1;
  let ks = {
    pub: keys.pub.n.toString(),
    priv: keys.sec.lambda.toString()
  }

  //encrypting vote
  let choices = [];

  let votes = vote.split('');
  console.log(votes);
  votes.forEach(function(v, idx) {
    choices[idx] = keys.pub.encrypt(nbv(v));
  });

  //now add all cryptos
  let final;
  choices.forEach(function(c) {
    if(!final) {
      final = c;
      return;
    }
    final = keys.pub.add(final,c);
  });

  ks.final = final.toString();

  ks.decrypted = keys.sec.decrypt(final).toString(10)

  res.send(JSON.stringify(ks, null, 2));
});

app.post('/decrypt-tally', function(req, res) {
  let vote = req.body.vote;
  let electionId = req.body.electionId;

  let decrypted = keys.sec.decrypt(req.body.vote).toString(10)
  
  res.send(decrypted);
});

app.get('/tally/:electionId/show-tally/', function(req, res) {

});

app.get('/tally/:electionId/show-private-key', function(req, res) {

});

app.get('/tally/:electionId/show-allowed-address-list', function(req, res) {
  
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});