// SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
contract Greenom is ERC20, ERC20Burnable, Ownable {
    //  mapping(address => uint256) public balances;
    constructor(
        uint256 initialSupply
    ) ERC20("Greenom", "GRO") Ownable(_msgSender()) {
        _mint(msg.sender, initialSupply);
    }

    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
    }
}
