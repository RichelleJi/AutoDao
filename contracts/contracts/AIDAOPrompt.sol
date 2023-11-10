// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract AIDAOPrompt {
    string public prompt;

    function setPrompt(string calldata _prompt) public {
        prompt = _prompt;
    }
}
