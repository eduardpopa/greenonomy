// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Item} from "./Item.sol";
import {Greenom} from "./Greenom.sol";
import {MemberMetadata} from "./Utils.sol";
import {console} from "@ganache/console.log/console.sol";

contract Market is Ownable {
    Greenom private coin;
    Item private factory;
    uint8 private maxSlots;
    uint256 private itemInitialValue;
    mapping(address => MemberMetadata) public members;
    uint256[] tokens;

    event ItemListed(uint256 addr);
    event ItemDelisted(uint256 addr);

    error MemberUnauthorizedAccount(address account);

    constructor(
        Greenom _coin,
        Item _factory,
        uint8 _maxSlots,
        uint256 _itemInitialValue
    ) Ownable(_msgSender()) {
        console.log("Market::constructor");
        console.logAddress(_msgSender());
        console.logAddress(address(_coin));
        console.logAddress(address(_factory));
        maxSlots = _maxSlots;
        itemInitialValue = _itemInitialValue;
        coin = _coin;
        factory = _factory;
        MemberMetadata memory _member = MemberMetadata({
            isActive: true,
            slots: maxSlots
        });
        members[_msgSender()] = _member;
    }
    function getGreenomAddress() public view virtual returns (address) {
        return address(coin);
    }
    function getItemAddress() public view virtual returns (address) {
        return address(factory);
    }
    function invite(address addr) external onlyMember {
        // TODO: tcheck if this override an inactive/max slots called multiple times
        MemberMetadata memory member = MemberMetadata({
            isActive: true,
            slots: maxSlots
        });
        members[addr] = member;
    }
    function createItem(string calldata uri) external payable onlyMember {
        console.log("Market::createItem");
        console.logAddress(_msgSender());
        Item(factory).safeMint(_msgSender(), uri);
    }

    function listItem(uint256 tokenId) external onlyMemberWithSlots {
        require(
            Item(factory).owner() == owner(),
            "Item was not created for this market"
        );
        members[_msgSender()].slots--;
        Item(factory).transferFrom(_msgSender(), owner(), tokenId);
        tokens.push(tokenId);
        emit ItemListed(tokenId);
    }

    function buyItem(uint256 tokenId) external onlyMember {
        Item(factory).transferFrom(owner(), _msgSender(), tokenId);
        Greenom(coin).transfer(_msgSender(), Item(factory).getValue(tokenId));
        emit ItemDelisted(tokenId);
    }
    function listedTokens() public view returns (uint256[] memory) {
        return Item(factory).getMyTokens();
    }

    modifier onlyMember() {
        _checkMember();
        _;
    }
    modifier onlyMemberWithSlots() {
        _checkMemberSlots();
        _;
    }
    function _checkMember() internal view virtual {
        if (!members[_msgSender()].isActive) {
            revert MemberUnauthorizedAccount(_msgSender());
        }
    }
    function _checkMemberSlots() internal view virtual {
        if (
            !members[_msgSender()].isActive && members[_msgSender()].slots > 0
        ) {
            revert MemberUnauthorizedAccount(_msgSender());
        }
    }
}
