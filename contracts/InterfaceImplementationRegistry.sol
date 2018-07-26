pragma solidity ^0.4.23;

interface InterfaceImplementationRegistry {
    function setInterfaceImplementer(address addr, bytes32 iHash, address implementer) external;
}