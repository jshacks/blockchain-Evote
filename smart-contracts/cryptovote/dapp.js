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


    console.log ("API Contract: ", contract);
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

// CONTRACTS INIT
// =============================================================================

function initContract (choices, electionID, startDate, endDate, callback) {
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
                                                                
                                                                // check address on the second call (contract deployed)
                                                                } else {
                                                                    console.log("Contract Address: ", contract.address) // the contract address
                                                                
                                                                    contract.castVote.call(['choice-1-crypt', 'choice-2-crypt']);
                                                                    contract.castVote.call(['choice-1-crypt', 'choice-2-crypt']);
                                                                    console.log(contract.voters.length);
                                                                    console.log ("Choices: ", contract.choices.length);


                                                                    callback(contract);
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
}


// PROCESS (CALL SEQUENCE)
// =============================================================================

startElection ();