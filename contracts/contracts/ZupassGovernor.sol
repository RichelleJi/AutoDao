pragma solidity ^0.8.10;
pragma experimental ABIEncoderV2;

import "./IZupassGovernor.sol";

contract ZupassGovernor is IZupassGovernor {

    string public prompt = "";
    uint public constant QUORUM = 4 * 10**4;
    uint public constant VOTING_PERIOD = 300;
    uint public numUsers = 0;
    address public admin;
    Proposal public currentProposal;

    mapping(address => uint) public users;
    mapping(uint => Proposal) proposals; 
    mapping(address => uint) public checkpoints;
    
    mapping(uint => mapping(address => int)) public votes;

    constructor(string memory _prompt) {
      admin = msg.sender;
      prompt = _prompt; 
    }

    function propose(string calldata _newPrompt) external returns (uint) {
      require(!_currentProposalLive(), "cannot create new proposal while current is being voted on");      
      if (_currentProposalExecutable()) {
        // execute the current proposal if its valid before starting vote on new one
        _executeCurrentProposal();
      }

      uint id = currentProposal.id + 1;

      proposals[id].proposer = msg.sender;
      proposals[id].proposedPrompt = _newPrompt;
      proposals[id].startTime = block.timestamp;
      proposals[id].endTime = block.timestamp + VOTING_PERIOD;
      proposals[id].forVotes = 0;
      proposals[id].againstVotes = 0;
      proposals[id].numUsers = numUsers;
      proposals[id].executed = false;

      proposals[id].id = id + 1;

      currentProposal = proposals[id];

      return currentProposal.id;

    }

    function register(address userAddress, uint semaphoreID) external {
      require(msg.sender == admin, "Only admin can register users");

      users[userAddress] = semaphoreID;
      // so users added after a proposal is live for voting can't vote on that proposal
      checkpoints[userAddress] = currentProposal.id;
      numUsers = numUsers + 1;
    }

    function isInRegistry(address user) external view returns (bool) {
      uint semaphoreID = users[user];

      return (semaphoreID > 0);
    }

    function proposedPrompt() public view returns (string memory) {
      return currentProposal.proposedPrompt;
    }

    function currentProposalDeadline() public view returns (uint) {
      return currentProposal.endTime;
    }

    function currentProposalID() public view returns (uint) {
      return currentProposal.id;
    }

    function currentProposalVotes() public view returns (uint) {
      return currentProposal.forVotes + currentProposal.againstVotes;
    }

    function currentProposalForVotes() public view returns (uint) {
      return currentProposal.forVotes;
    }

    function currentProposalAgainstVotes() public view returns (uint) {
      return currentProposal.againstVotes;
    }

    function currentProposer() public view returns (address) {
      return currentProposal.proposer;
    }

    function userVotesForProposal(address user, uint proposalID) public view returns (int) {
      return votes[proposalID][user];
    }

    function userVotesForCurrentProposal(address user) external view returns (int) {
      return votes[currentProposal.id][user];
    }
    
    function voteFor() external {
      require(checkpoints[msg.sender] < currentProposal.id, "cannot vote for proposals made before registration"); 
      if (votes[currentProposal.id][msg.sender] == -1) {
        currentProposal.againstVotes -= 1;
      } else if (votes[currentProposal.id][msg.sender] == 0) {
        currentProposal.forVotes += 1;
      }

      votes[currentProposal.id][msg.sender] = 1;            
    }

    function voteAgainst() external {
      require(checkpoints[msg.sender] < currentProposal.id, "cannot vote on proposals made before registration"); 
      if (votes[currentProposal.id][msg.sender] == 1) {
        currentProposal.forVotes -= 1;
      } else if (votes[currentProposal.id][msg.sender] == 0) {
        currentProposal.againstVotes += 1;
      }

      votes[currentProposal.id][msg.sender] = -1;            
    }

    function executeCurrentProposal() external {
      require(!_currentProposalLive(), "voting period not over");
      require(_currentProposalExecutable(), "current proposal not valid");

      _executeCurrentProposal();
    }

    function _executeCurrentProposal() internal {
      prompt = currentProposal.proposedPrompt;
      currentProposal.executed = true; 
    }

    function _quorumReached() internal view returns (bool) {
      uint quorum_num = QUORUM * numUsers / 10**6;
      return (currentProposalVotes() > quorum_num);
    }

    function _currentProposalExecutable() internal view returns (bool) {
      return (_quorumReached() && !currentProposal.executed);
    }

    function _currentProposalLive() internal view returns (bool) {
      return (currentProposal.startTime < block.timestamp && currentProposal.endTime > block.timestamp);
    }

    function getProposal(uint id) public view returns (Proposal memory) {
      return proposals[id];
    }
}
