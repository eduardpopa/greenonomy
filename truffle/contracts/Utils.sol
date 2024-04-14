// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct MemberMetadata {
    bool isActive;
    uint8 slots;
}
struct ItemMetadata {
    string uri;
    uint256 value;
    address[] owners;
    uint8 transactionsLeft;
}
library Utils {
    function _itemExist(
        uint256[] memory items,
        uint256 item
    ) public pure returns (bool) {
        bool exist = false;
        for (uint i = items.length - 1; i >= 0; i--) {
            if (items[i] == item) {
                exist = true;
                break;
            }
        }
        return exist;
    }
    function _removeItem(
        uint256[] memory items,
        uint256 item
    ) public pure returns (uint256[] memory) {
        uint index;
        for (uint i = items.length - 1; i >= 0; i--) {
            if (items[i] == item) {
                index = i;
                break;
            }
        }
        for (uint i = index; i < items.length - 1; i++) {
            items[i] = items[i + 1];
        }
        delete items[items.length - 1];
        return items;
    }
}
