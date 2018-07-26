pragma solidity ^0.4.23;

contract ContractReceiver {
    function tokenFallback(address _from, uint _value, bytes _data) public;
}