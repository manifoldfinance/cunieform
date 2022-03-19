/** 
 * 
 * @export VaultABI
 * @export SlurpABI
 * 
 */

import { ethers } from "ethers";

// Vault ABI Data Set 
export const VaultABI = new ethers.utils.Interface([
    // TODO: ERC4262 - add the correct ABI
    // Vaults 
    "function getBorrowRatePerSecondInEther() external view returns (uint256)",
    "function getSupplyRatePerSecondInEther() external view returns (uint256)",
    "function getUtilizationRateInEther() external view returns (uint256)",
    "function totalOutstandingDebt() external view returns (uint256)",
    "function getTotalAvailableCash() external view returns (uint256)",
    "function maxTotalDeposit() external view returns (uint256)",

    // Margined token
    "function getCollateralPerManifoldToken(address token) external view returns (uint256)",
    "function getDebtPerManifoldToken(address token) external view returns (uint256)",
    "function getLeverageRatioInEther(address token) external view returns (uint256)",
    "function getNAV(address token) external view returns (uint256)",
    "function getMetadata(address token) external view returns (bool isETH, address token, address collateral, address oracleContract, address swapContract, uint256 maxSwapSlippageInEther, uint256 initialPrice, uint256 feeInEther, uint256 totalCollateralPlusFee,  uint256 totalPendingFees, uint256 minLeverageRatioInEther, uint256 maxLeverageRatioInEther, uint256 maxRebalancingValue, uint256 rebalancingStepInEther, uint256 maxTotalCollateral)",
    "function getOutstandingDebt(address token) external view returns (uint256)",
]);

// Slurp Routing Payments etc
export const SlurpABI = new ethers.utils.Interface([
    // Slurp data
    "function totalOutstandingProfits() external view returns (uint256)",
    "function getNetProfitRatePerSecondInEther() external view returns (uint256)",
    "function getGrossProfitRatePerSecondInEther() external view returns (uint256)",
]);


// Any ERC20 Asset
export const ERC20ABI = new ethers.utils.Interface(["function totalSupply() external view returns (uint256)"]);

// TWAP ABI Data Set
export const OracleABI = new ethers.utils.Interface(["function getPrice() external view returns (uint256)"]);

/// OpenMEV
export const RouterABI = new ethers.utils.Interface(["function getPrice() external view returns (uint256)"]);