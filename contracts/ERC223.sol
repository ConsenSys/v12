pragma solidity ^0.4.23;

contract TokenRecipient {
    function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData) public;
}

contract ERC223 {
    event Transfer(address indexed from, address indexed to, uint value, bytes  data);
    function transfer(address to, uint value, bytes data) public returns (bool ok);
    function transfer(address to, uint value, bytes data, string customFallback) public returns (bool ok);
}


contract ContractReceiver {
    function tokenFallback(address _from, uint _value, bytes _data) public;
}