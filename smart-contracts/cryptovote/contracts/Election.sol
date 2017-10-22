pragma solidity ^0.4.11;

contract Election {

// STRUCT
// =============================================================================

struct Choice {
    bytes32 choiceID;
    bytes32 name;
}

struct Voter {
    bytes32 vAddress;
    bool vHasVoted;
    bytes32[] vChoices;
}

// VARIABLES
// =============================================================================
 
  // mapping (bytes32 => uint8) public votesReceived;

  bytes32[] candidateList;
  bytes32 ID;
  uint startDate;
  uint endDate;
  bytes32[] choices;
  int8 answers; 
  bytes32  vAddress;
  Voter voter; 
  
  mapping (address => Voter) public votes; 
    
// CONSTRUCTOR
// =============================================================================

  function Election(bytes32[] candidateNames, bytes32 electionID, uint start, uint end, bytes32[] validChoices, int8 validAnswers) {
    candidateList = candidateNames;
    ID = electionID;
    startDate = start;
    endDate = end;
    choices = validChoices;
    answers = validAnswers;
  }

 
// VOTE
// =============================================================================

  function vote(bytes32[] choices) {
      address sender = msg.sender;
      if (!votes[sender].vHasVoted) {
          votes[sender].vChoices = choices;
     }
  }

  /* function totalVotesFor(bytes32 candidate) returns (uint8) {
    if (validCandidate(candidate) == false) throw;
    return votesReceived[candidate];
  }

  // This function increments the vote count for the specified candidate. This
  // is equivalent to casting a vote
  function voteForCandidate(bytes32 candidate) {
    if (validCandidate(candidate) == false) throw;
    votesReceived[candidate] += 1;
  }

  function validCandidate(bytes32 candidate) returns (bool) {
    for(uint i = 0; i < candidateList.length; i++) {
      if (candidateList[i] == candidate) {
        return true;
      }
    }
    return false;
  } */
}