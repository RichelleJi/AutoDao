// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

contract AIDAOPrompt {
    string public prompt;

    function setPrompt(string calldata _prompt) public {
        prompt = _prompt;
    }
}
