// INIT
// =============================================================================
var Web3 = require('web3');
const fs  = require('fs');
const solc = require('solc');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
/* 
// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;        // set our port

// ROUTES
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.get('/', function(req, res) {
    console.log (req);  
});


router.post('/', function(req, res) {
    console.log (req.body);
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api/init', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
*/
// CONTRACTS
// =============================================================================

// Show Contracts
//console.log ("Web3 Accounts: ", web3.eth.accounts);

// Compile Contract
var code = fs.readFileSync('contracts/Election.sol').toString();
//console.log (code);

var compiledCode = solc.compile(code);

///console.log ("Compiled Code: ", compiledCode);

//console.log ("Gas Estimates: ", compiledCode.contracts[':Election'].gasEstimates);

// Deploy Contract
var abiDefinition = JSON.parse(compiledCode.contracts[':Election'].interface);
var ElectionContract = web3.eth.contract(abiDefinition);

// Instantiate by Address
// var contractInstance = ElectionContract.at(address);

// Deploy New Contract
var byteCode = compiledCode.contracts[':Election'].bytecode;
// let gasEstimate = web3.eth.estimateGas({data: byteCode});
var gasEstimate = compiledCode.contracts[':Election'].gasEstimates.creation[1] * 5; // high gas estimation - to be changed/removed


//console.log ("Gas Estimate: ", gasEstimate);

var contractInstance = ElectionContract.new(
                                                ['0x0001','0x0002','0x0003'], 
                                                ['ELECTID01'],
                                                [1508604323], 
                                                [1508604323],
                                                ["Choice 1", "Choice 2"], 
                                                [2],
                                                {
                                                    data: byteCode, 
                                                    from: web3.eth.accounts[0], 
                                                    gas: gasEstimate}, function (err, contract) {
                                                            if (err) throw err;
                                                            // NOTE: The callback will fire twice!
                                                            // Once the contract has the transactionHash property set and once its deployed on an address.
                                                            console.log (contract);
                                                            // e.g. check tx hash on the first call (transaction send)
                                                            if(!contract.address) {
                                                                //console.log("Contract Transaction Hash: ", contract.transactionHash) // The hash of the transaction, which deploys the contract
                                                            
                                                            // check address on the second call (contract deployed)
                                                            } else {
                                                                console.log("Contract Address: ", contract.address) // the contract address
                                                            

                                                                contract.vote.call(['choice-1', 'choice-2']);

                                                                console.log (contract.votes.getData(web3.eth.accounts[9]));
                                                            }

                                                            //console.log ("Total votes for Rama: ", contract.totalVotesFor.call('Rama'));
                                                     
                                                            // Note that the returned "myContractReturned" === "myContract",
                                                            // so the returned "myContractReturned" object will also get the address set.
                                                    
                                                    });
                                                
// console.log ("Deployed Contract Address: ", deployedContract.address);
//var contractInstance = ElectionContract.at(deployedContract.address);

// Get the data to deploy the contract manually
//var contractData = ElectionContract.new.getData(['Rama','Nick','Jose'], {data: byteCode});

// Interact with the contract
