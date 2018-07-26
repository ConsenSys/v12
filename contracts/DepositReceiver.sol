pragma solidity ^0.4.23;

interface DepositReceiver {
    function deposit(address target) external payable returns (bool);
    function depositToken(address token, address target, uint256 amount) external returns (bool);
}