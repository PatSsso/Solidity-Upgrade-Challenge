// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import {IERC20} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";

import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract Dex is Ownable2Step {
    IERC20 private immutable dai;
    IERC20 private immutable usdc;

    // exchange rate indexes
    uint256 constant DEX_A_RATE = 90;
    uint256 constant DEX_B_RATE = 100;

    mapping(address => uint256) public daiBalances;
    mapping(address => uint256) public usdcBalances;

    error InvalidAllowance();

    constructor(address _dai, address _usdc) {
        dai = IERC20(_dai);
        usdc = IERC20(_usdc);
    }

    function loop(uint256[] calldata _uints) external pure returns(uint _some) {
        uint256 length = _uints.length;
        for(uint i = 0; i < length;) {
            if(i > 5) {
                return _some = _uints[i];
            }
            unchecked {
                i++;
            }
        }
    }

    function depositUSDC(uint256 _amount) external {
        uint256 allowance = usdc.allowance(msg.sender, address(this));

        if (allowance < _amount) revert InvalidAllowance();

        usdcBalances[msg.sender] += _amount;

        usdc.transferFrom(msg.sender, address(this), _amount);
    }

    function depositDAI(uint256 _amount) external {
        uint256 allowance = dai.allowance(msg.sender, address(this));

        if (allowance < _amount) revert InvalidAllowance();

        daiBalances[msg.sender] += _amount;

        dai.transferFrom(msg.sender, address(this), _amount);
    }

    function buyDAI() external {
        uint256 daiToReceive = ((usdcBalances[msg.sender] / DEX_A_RATE) * 100) * (10 ** 12);

        dai.transfer(msg.sender, daiToReceive);
    }

    function sellDAI() external {
        uint256 usdcToReceive = ((daiBalances[msg.sender] * DEX_B_RATE) / 100) / (10 ** 12);

        usdc.transfer(msg.sender, usdcToReceive);
    }

    function getBalance(IERC20 _token) external view returns (uint256) {
        return _token.balanceOf(address(this));
    }

    function withdraw(IERC20 _token) external onlyOwner {
        _token.transfer(msg.sender, _token.balanceOf(address(this)));
    }
}
