// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IEmployees {
    function balanceOf(address _owner) external view returns (uint256);

    function transfer(address to, uint256 value)
        external
        returns (bool);
}
