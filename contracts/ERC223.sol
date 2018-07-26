pragma solidity ^0.4.23;

contract ERC223 {
    event Transfer(address indexed from, address indexed to, uint value, bytes  data);
    function transfer(address to, uint value, bytes data) public returns (bool ok);
    function transfer(address to, uint value, bytes data, string customFallback) public returns (bool ok);
}