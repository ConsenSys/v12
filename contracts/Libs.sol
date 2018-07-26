pragma solidity ^0.4.23;

library BytesToAddress {
    function toAddress(bytes _address) internal pure returns (address) {
        if (_address.length < 20) return address(0);

        uint160 m = 0;
        uint160 b = 0;
        for (uint8 i = 0; i < 20; i++) {
            m *= 256;
            b = uint160(_address[i]);
            m += (b);
        }

        return address(m);
    }
}

library AddressToBytes {
    function toBytes(address a) internal pure returns (bytes b) {
        assembly {
            let m := mload(0x40)
            mstore(add(m, 20), xor(0x140000000000000000000000000000000000000000, a))
            mstore(0x40, add(m, 52))
            b := m
        }
    }
}