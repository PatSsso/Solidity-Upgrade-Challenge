// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import {FlashLoanSimpleReceiverBase} from "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IERC20} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";

import "@openzeppelin/contracts/access/Ownable2Step.sol";

interface IDex {
    function depositUSDC(uint256 _amount) external;

    function depositDAI(uint256 _amount) external;

    function buyDAI() external;

    function sellDAI() external;
}

contract FlashLoanArbitrage is FlashLoanSimpleReceiverBase, Ownable2Step {
    IERC20 private immutable dai;
    IERC20 private immutable usdc;
    IDex private immutable dex;

    uint256 constant DEPOSIT_USDC = 1000000000; // 1000 USDC

    constructor(
        address _addressProvider,
        address _dai,
        address _usdc,
        address _dex
    )
        FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider))
    {

        dai = IERC20(_dai);
        usdc = IERC20(_usdc);
        dex = IDex(_dex);
    }

    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {

        dex.depositUSDC(DEPOSIT_USDC);
        dex.buyDAI();
        dex.depositDAI(dai.balanceOf(address(this)));
        dex.sellDAI();

        uint256 amountOwed = amount + premium;
        IERC20(asset).approve(address(POOL), amountOwed);

        return true;
    }

    function requestFlashLoan(
        address _token,
        uint256 _amount,
        bytes calldata _params,
        uint16 _referralCode
    ) external {

        POOL.flashLoanSimple(
            address(this),
            _token,
            _amount,
            _params,
            _referralCode
        );
    }

     function approveUSDC(uint256 _amount) external returns (bool) {
        return usdc.approve(address(dex), _amount);
    }

    function allowanceUSDC() external view returns (uint256) {
        return usdc.allowance(address(this), address(dex));
    }

    function approveDAI(uint256 _amount) external returns (bool) {
        return dai.approve(address(dex), _amount);
    }

    function allowanceDAI() external view returns (uint256) {
        return dai.allowance(address(this), address(dex));
    }

    function getBalance(IERC20 _token) external view returns (uint256) {
        return _token.balanceOf(address(this));
    }

    function withdraw(IERC20 _token) external onlyOwner {
        _token.transfer(msg.sender, _token.balanceOf(address(this)));
    }
}
