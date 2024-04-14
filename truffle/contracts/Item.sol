// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {ItemMetadata, Utils} from "./Utils.sol";
import {console} from "@ganache/console.log/console.sol";

contract Item is ERC721, ERC721Burnable, Ownable {
    uint256 private _nextTokenId;
    uint8 private _maxTransactions;
    uint private _increasePercentage;
    mapping(address => uint256[]) public _memberTokens;
    mapping(uint256 => ItemMetadata) public _tokens;

    event ValueIncreased(uint256 indexed tokenId, uint256 newValue);
    event ItemLocked(uint256 indexed tokenId);

    error OwnerUnauthorizedAccount(address account);

    constructor(
        uint8 maxTransactions,
        uint8 increasePercentage
    ) ERC721("Item", "ITM") Ownable(_msgSender()) {
        _maxTransactions = maxTransactions;
        _increasePercentage = increasePercentage;
    }
    function getMyTokens() public view returns (uint256[] memory) {
        return _memberTokens[_msgSender()];
    }
    function getMetadata(
        uint256 tokenId
    ) public view returns (ItemMetadata memory) {
        return _tokens[tokenId];
    }
    function getValue(uint256 tokenId) public view returns (uint256) {
        return _tokens[tokenId].value;
    }
    function hasTransactionsLeft(
        uint256 tokenId
    ) public view virtual returns (bool) {
        return _tokens[tokenId].transactionsLeft > 0;
    }
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        require(_isTokenOwner(tokenId, from), "Only owner can transfer it.");
        require(hasTransactionsLeft(tokenId), "Item has no transactions left.");
        require(
            !_wasOwner(tokenId, to),
            "Item cannot send back to a previous owner."
        );

        ItemMetadata storage metadata = _tokens[tokenId];
        // TODO: check math functions
        uint256 increaseAmount = (metadata.value * _increasePercentage) / 100;
        uint256 newValue = metadata.value + increaseAmount;

        metadata.owners.push(from);
        metadata.transactionsLeft--;
        metadata.value = newValue;

        _memberTokens[to].push(tokenId);
        _memberTokens[from] = Utils._removeItem(_memberTokens[from], tokenId);

        _tokens[tokenId] = metadata;

        super.transferFrom(from, to, tokenId);
        emit ValueIncreased(tokenId, newValue);
    }

    function _wasOwner(
        uint256 tokenId,
        address addr
    ) internal view virtual returns (bool) {
        bool found = false;
        address[] memory _owners = _tokens[tokenId].owners;
        for (uint i = 0; i < _owners.length; i++) {
            if (_owners[i] == addr) {
                found = true;
                break;
            }
        }
        return found;
    }
    function _isTokenOwner(
        uint256 tokenId,
        address addr
    ) internal view virtual returns (bool) {
        return Utils._itemExist(_memberTokens[addr], tokenId);
    }
    function safeMint(address to, string memory uri) public onlyOwner {
        console.log("Item::safeMint");
        console.logAddress(to);
        console.log(uri);
        uint256 tokenId = _nextTokenId++;

        _safeMint(to, tokenId);
        ItemMetadata memory data = ItemMetadata({
            uri: uri,
            value: 0,
            owners: new address[](0),
            transactionsLeft: _maxTransactions
        });
        _tokens[tokenId] = data;
        _memberTokens[to].push(tokenId);
    }
}
