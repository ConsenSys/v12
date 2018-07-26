pragma solidity ^0.4.23;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

interface ITokenRecipient {
    function tokensReceived(
        address from,
        address to,
        uint amount,
        bytes userData,
        address operator,
        bytes operatorData
    ) external;
}