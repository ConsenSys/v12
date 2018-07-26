pragma solidity ^0.4.23;

import "./Libs.sol";
import "./ERC223.sol";
import "./Token.sol";
import "./DepositReceiver.sol";
import "./EIP777.sol";
import "./InterfaceImplementationRegistry.sol";

contract DepositProxy {
    using AddressToBytes for address;
    address public beneficiary;
    address public exchange;
    event Deposit(address token, uint256 amount);

    constructor(address _exchange, address _beneficiary) public {
        exchange = _exchange;
        beneficiary = _beneficiary;
        
        //:TODO
        //registerEIP777Interface();
    }

    function tokenFallback(address /* sender */, uint256 amount, bytes /* data */) public {
        require(ERC223(msg.sender).transfer(exchange, amount, beneficiary.toBytes()));
        emit Deposit(msg.sender, amount);
    }

    function tokensReceived(address /* from */, address to, uint256 amount, bytes /* userData */, address /* operator */, bytes /* operatorData */) public {
        require(to == address(this));
        EIP777(msg.sender).send(exchange, amount, beneficiary.toBytes());
        emit Deposit(msg.sender, amount);
    }

    function approveAndDeposit(address token, uint256 amount) internal {
        require(Token(token).approve(exchange, amount));
        require(DepositReceiver(exchange).depositToken(token, beneficiary, amount));
        emit Deposit(token, amount);
    }
  
    function receiveApproval(address _from, uint256 _tokens, address _token, bytes /* _data */) public {
        require(_token == msg.sender);
        require(Token(_token).transferFrom(_from, this, _tokens));
        approveAndDeposit(_token, _tokens);
    }
    
    function depositAll(address token) public {
        approveAndDeposit(token, Token(token).balanceOf(this));
    }

    function registerEIP777Interface() internal {
        InterfaceImplementationRegistry(0x9aA513f1294c8f1B254bA1188991B4cc2EFE1D3B).setInterfaceImplementer(this, keccak256("ITokenRecipient"), this);
    }
    
    function () external payable {
        DepositReceiver(exchange).deposit.value(msg.value)(beneficiary);
        emit Deposit(0x0, msg.value);
    }
}