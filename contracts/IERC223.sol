pragma solidity ^0.4.23;

interface ERC223 {
    function transfer(address target, uint256 amount, bytes data) external returns (bool);
}