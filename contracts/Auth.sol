// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Auth {

    // Mapping to store user credentials
    mapping(address => bool) public authorizedUsers;

    // Event to emit when a user is authorized
    event UserAuthorized(address indexed user);

    // Function to authorize a user
    function authorizeUser(address _user) public {
        authorizedUsers[_user] = true;
        emit UserAuthorized(_user);
    }

    // Function to check if a user is authorized
    function isUserAuthorized(address _user) public view returns (bool) {
        return authorizedUsers[_user];
    }
}