// INIT
// =============================================================================
var Web3 = require('web3');
const fs  = require('fs');
const solc = require('solc');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');


function api(contract) {
    // configure app to use bodyParser()
    // this will let us get the data from a POST
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    var port = 3001;        // set our port


    // console.log ("API Contract: ", contract);
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
}
// GET ELECTION DETAILS
// =============================================================================

function startElection () {
    // Call WS
    var choices = ["ch1","ch2","ch3","ch4","ch5"];
    var electionID = [1];
    var date = new Date();
    var startDate = date.getTime();
    var endDate = startDate + 3600;
        // Init Contract
    initContract (choices, electionID, startDate, endDate, api);
} 

// VOTE
// =============================================================================
function castVote () {

    
    var address = contractInstance.contractAddress;

    var contract = ElectionContract.at(address);

    contract.castVote.call(['choice-1-crypt', 'choice-2-crypt']);
    contract.castVote.call(['choice-2-crypt', 'choice-2-crypt']);
    contract.castVote.call(['choice-1-crypt', 'choice-2-crypt']);
    contract.castVote.call(['choice-1-crypt', 'choice-2-crypt']);
    contract.castVote.call(['choice-1-crypt', 'choice-2-crypt']);
    // setTimeout(function(){
    //     console.log("Vote count:", contract.getVoteCount.call().toString());
    //     // console.log ("Choices: ", contract.choices.length);
    //     // console.log("Voter x:",contract.getVoter.call(0));

    // },10000);                
    console.log("Vote count:", contract.getVoteCount.call().toString());

}



// CONTRACTS INIT
// =============================================================================

var code;
var compiledCode;
var abiDefinition;
var ElectionContract;
var byteCode;
var gasEstimate;
var contractInstance;

function initContract (choices, electionID, startDate, endDate, callback) {
    // Show Contracts
    //console.log ("Web3 Accounts: ", web3.eth.accounts);

    // Compile Contract
    code = fs.readFileSync('contracts/Election.sol').toString();
    //console.log (code);

    compiledCode = solc.compile(code);

    ///console.log ("Compiled Code: ", compiledCode);

    //console.log ("Gas Estimates: ", compiledCode.contracts[':Election'].gasEstimates);

    // Deploy Contract
    abiDefinition = JSON.parse(compiledCode.contracts[':Election'].interface);
    ElectionContract = web3.eth.contract(abiDefinition);

    // Instantiate by Address
    // var contractInstance = ElectionContract.at(address);

    // Deploy New Contract
    byteCode = compiledCode.contracts[':Election'].bytecode;
    // let gasEstimate = web3.eth.estimateGas({data: byteCode});
    gasEstimate = compiledCode.contracts[':Election'].gasEstimates.creation[1] * 5; // high gas estimation - to be changed/removed


    //console.log ("Gas Estimate: ", gasEstimate);

    contractInstance = ElectionContract.new(
                                                    choices, 
                                                    electionID,
                                                    startDate, 
                                                    endDate,
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
                                                                    // Transaction has entered to geth memory pool
                                                                    console.log("Your contract is being deployed in transaction at " + contractInstance.transactionHash);
                                                                // check address on the second call (contract deployed)
                                                                } else {
                                                                    console.log("Contract Address: ", contract.address) // the contract address
                                                                
                                                                    
                                                              
                                                                    //TODO: move it
                                                                    //callback(contract);
                                                                }

                                                                // waitBlock(castVote);

                                                                
                                                                // Note that the returned "myContractReturned" === "myContract",
                                                                // so the returned "myContractReturned" object will also get the address set.
                                                        
                                                        });
                                                    
    // console.log ("Deployed Contract Address: ", deployedContract.address);
    //var contractInstance = ElectionContract.at(deployedContract.address);

    // Get the data to deploy the contract manually
    //var contractData = ElectionContract.new.getData(['Rama','Nick','Jose'], {data: byteCode});

    // Interact with the contract
}




// PROCESS (CALL SEQUENCE)
// =============================================================================

startElection ();



// http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// We need to wait until any miner has included the transaction
// in a block to get the address of the contract
function waitBlock(callback) {
    while (true) {
      let receipt = web3.eth.getTransactionReceipt(contractInstance.transactionHash);
      if (receipt && receipt.contractAddress) {
        console.log("Your contract has been deployed at " + receipt.contractAddress);
        console.log("Note that it might take 30 - 90 sceonds for the block to propagate befor it's visible in etherscan.io");
        break;
      }
      console.log("Waiting a mined block to include your contract... currently in block " + web3.eth.blockNumber);
      sleep(4000);
    }
    callback();
  }
  
//   waitBlock(castVote);

