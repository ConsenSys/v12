pragma solidity ^0.4.23;

contract Owned {
    address public owner;
    
    constructor() public {
        owner = msg.sender;
    }

    event SetOwner(address indexed previousOwner, address indexed newOwner);
  
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function setOwner(address newOwner) public onlyOwner {
        emit SetOwner(owner, newOwner);
        owner = newOwner;
    }
}