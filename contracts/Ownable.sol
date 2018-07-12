pragma solidity ^0.4.23;

//Owner Contract-For Defining Owner and Transferring Ownership
contract Ownable {
    address public owner;

    constructor() public {
        owner = 0x2e1977127F682723C778bBcac576A4aF2c0e790d;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) onlyOwner public {
        owner = newOwner;
    }
}