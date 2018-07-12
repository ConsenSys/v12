pragma solidity ^0.4.23;

import "./SafeMath.sol";
import "./Ownable.sol";
import "./ERC223.sol";

//Token Format
contract ERC20 is Ownable {
    using SafeMath for uint256;
    //Public Variables of the token
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;


    mapping (address => uint256) public balances;

    mapping (address => mapping (address => uint256)) public allowed;

    /* This generates a public event on the blockchain that will notify clients */
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed _owner, address indexed _spender, uint _value);

    //Constructor
    constructor(
    uint256 _initialSupply,
    string _tokenName,
    uint8 _decimalUnits,
    string _tokenSymbol
    ) public
    {
        //remove this address in favour of sender
        //0x2e1977127F682723C778bBcac576A4aF2c0e790d
        balances[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
        decimals = _decimalUnits;
        symbol = _tokenSymbol;
        name = _tokenName;
    }

    /* public methods */
    function transfer(address _to, uint256 _value) public returns (bool) {

        bool status = transferInternal(msg.sender, _to, _value);

        require(status == true);

        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {

        allowed[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function approveAndCall(address _spender, uint256 _value, bytes _extraData) public returns (bool success) {

        TokenRecipient spender = TokenRecipient(_spender);

        if (approve(_spender, _value)) {
            spender.receiveApproval(msg.sender, _value, this, _extraData);
            return true;
        }
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {

        if (allowed[_from][msg.sender] < _value) {
            return false;
        }

        bool _success = transferInternal(_from, _to, _value);

        if (_success) {
            allowed[_from][msg.sender] -= _value;
        }

        return _success;
    }

    /*constant functions*/
    function totalSupply() public view returns (uint256) {
        return totalSupply;
    }

    function balanceOf(address _address) public view returns (uint256 balance) {
        return balances[_address];
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }

    /* internal functions*/
    function setBalance(address _holder, uint256 _amount) internal {
        balances[_holder] = _amount;
    }

    function transferInternal(address _from, address _to, uint256 _value) internal returns (bool success) {

        if (_value == 0) {
            emit Transfer(_from, _to, _value);

            return true;
        }

        if (balances[_from] < _value) {
            return false;
        }

        setBalance(_from, balances[_from].sub(_value));
        setBalance(_to, balances[_to].add(_value));

        emit Transfer(_from, _to, _value);

        return true;
    }
}