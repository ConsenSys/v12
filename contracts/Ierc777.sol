pragma solidity ^0.4.23;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
interface Ierc777 {
    function name() external view returns (string);
    function symbol() external view returns (string);
    function totalSupply() external view returns (uint256);
    function granularity() external view returns (uint256);
    function balanceOf(address owner) external view returns (uint256);

    function send(address to, uint256 amount) external;
    function send(address to, uint256 amount, bytes userData) external;

    function authorizeOperator(address operator) external;
    function revokeOperator(address operator) external;
    function isOperatorFor(address operator, address tokenHolder) external view returns (bool);
    function operatorSend(address from, address to, uint256 amount, bytes userData, bytes operatorData) external;

    event Sent( // solhint-disable-line no-simple-event-func-name
        address indexed from,
        address indexed to,
        uint256 amount,
        bytes userData,
        address indexed operator,
        bytes operatorData
    ); 
    
    // solhint-disable-next-line separate-by-one-line-in-contract
    event Minted(address indexed to, uint256 amount, address indexed operator, bytes operatorData);
    event Burned(address indexed from, uint256 amount);
    // solhint-disable-next-line no-simple-event-func-name
    event AuthorizedOperator(address indexed operator, address indexed tokenHolder);
    event RevokedOperator(address indexed operator, address indexed tokenHolder);
}