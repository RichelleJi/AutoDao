pragma solidity ^0.8.10;
pragma experimental ABIEncoderV2;

import "./IZupassGovernor.sol";

contract ZupassGovernor is IZupassGovernor, GovernorBravoDelegateStorageV1, GovernorBravoEvents {

    uint public currentProposalID = 0;
    string public prompt = "";
    uint public constant QUOROM = 4 * 10**4;
    uint public constant VOTING_PERIOD = 300;
    uint public numUsers = 0;
    address public admin;

    mapping(address => uint) public users;
    //mapping(uint => Proposal) proposals; 
    
    constructor(string memory _prompt) {
      admin = msg.sender;
      prompt = _prompt; 
    }

    function propose(string calldata _newprompt) external returns (uint) {


      currentProposalID = currentProposalID + 1;
      return currentProposalID;

    }

    function register(address userAddress, uint semaphoreID) external {
      users[userAddress] = semaphoreID;
      numUsers = numUsers + 1;
    }

    function isInRegistry(address user) external view returns (bool) {
      uint semaphoreID = users[user];

      return (semaphoreID > 0);
    }

    function proposedPrompt() public view returns (string memory) {
      return "bleh";
    }

    function proposalDeadline() public view returns (uint) {
      return 1000;
    }

    function currentProposalVotes() public view returns (uint) {
      return 5;
    }

    function currentProposalForVotes() public view returns (uint) {
      return 3;
    }

    function executeProposal() external {
      require(msg.sender == admin, "only admin");
    }

    //function getProposal(uint id) public view returns (Proposal memory) {
    //  return proposals[id];
    //}

    function getChainIdInternal() internal view returns (uint) {
        uint chainId;
        assembly { chainId := chainid() }
        return chainId;
    }
}
