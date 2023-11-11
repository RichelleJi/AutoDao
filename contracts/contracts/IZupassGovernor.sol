// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.10;

struct Proposal {
        /// @notice Unique id for looking up a proposal
        uint id;

        address proposer;
        string proposedPrompt;
        uint startTime;
        uint endTime;
        uint forVotes;
        uint againstVotes;
        uint numUsers;
        bool executed;
  }


interface IZupassGovernor {


  function admin() external view returns (address);

  /// can only be called by admin
  function register(address user, uint semaphoreID) external;

  /// returns true if user is in registry
  function isInRegistry(address user) external view returns (bool);

  /// returns proposal id if proposal is successfully enqueued else reverts
  function propose(string calldata _newprompt) external returns (uint);

  /// returns current prompt
  function prompt() external view returns (string memory);

  /// returns currently proposed prompt
  function proposedPrompt() external view returns (string memory);

  /// returns deadline for voting for current proposal as timestamp
  function currentProposalDeadline() external view returns (uint);

  /// returns current number of votes cast FOR or AGAINST current proposal
  function currentProposalVotes() external view returns (uint);

  /// returns current number of votes FOR current proposal
  function currentProposalForVotes() external view returns (uint);

  /// returns current number of votes AGAINST current proposal
  function currentProposalAgainstVotes() external view returns (uint);

  /// returns address which makde current proposal
  function currentProposer() external view returns (address);

  /// returns zero if user hasn't voted for a proposal, 1 if for, -1 if against
  function userVotesForProposal(address user, uint proposalID) external view returns (int);

  /// returns zero if user hasn't voted for current proposal, 1 if for, -1 if against
  function userVotesForCurrentProposal(address user) external view returns (int);


  /// execute the current proposal if it is valid
  function executeCurrentProposal() external;

  function voteFor() external;

  function voteAgainst() external;

  // returns num registered users
  function numUsers() external returns (uint);

  /// returns a previous proposal by its id
  //function getProposal(uint id) external view returns (Proposal memory);
}

