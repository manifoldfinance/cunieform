import { BigNumber, ethers } from "ethers";
import { Connection } from "typeorm";
import { VaultSnapshot } from "../entities/VaultSnapshot";

import { VaultABI } from "./abi";

async function cunieform(vaultContractAddress: string, provider: ethers.providers.JsonRpcProvider, connection: Connection) {
    // Initialize the contract
    const manifoldTokenVaultContract = new ethers.Contract(vaultContractAddress, VaultABI, provider);

    // Get supply APY
    const supplyRatePerSecondInEther: BigNumber = await manifoldTokenVaultContract.getSupplyRatePerSecondInEther();
    const supplyRatePerSecond = parseFloat(ethers.utils.formatEther(supplyRatePerSecondInEther));
    const secondsPerDay = 86400;
    const daysPerYear = 365;
    const supplyAPY = (Math.pow(supplyRatePerSecond * secondsPerDay + 1, daysPerYear) - 1) * 100;
    console.log("[#DEBUG]: supplyAPY", supplyAPY);

    // Get borrow APY
    const borrowRatePerSecondInEther: BigNumber = await manifoldTokenVaultContract.getBorrowRatePerSecondInEther();
    const borrowRatePerSecond = parseFloat(ethers.utils.formatEther(borrowRatePerSecondInEther));
    const borrowAPY = (Math.pow(borrowRatePerSecond * secondsPerDay + 1, daysPerYear) - 1) * 100;
    console.log("[#DEBUG]: borrowAPY", borrowAPY);

    // Get utilization rate
    const utilizationRateInEther: BigNumber = await manifoldTokenVaultContract.getUtilizationRateInEther();
    const utilizationRate = parseFloat(ethers.utils.formatEther(utilizationRateInEther));
    const utilizationRatePercentage = utilizationRate * 100;
    console.log("[#DEBUG]: utilizationRatePercentage", utilizationRatePercentage);

    // Get total outstanding debt
    const totalOutstandingDebt: BigNumber = await manifoldTokenVaultContract.totalOutstandingDebt();
    const totalOutstandingDebtFloat = parseFloat(ethers.utils.formatUnits(totalOutstandingDebt, 6));
    console.log("[#DEBUG]: totalOutstandingDebtFloat", totalOutstandingDebtFloat);

    // Get total outstanding debt
    const totalAvailableCash: BigNumber = await manifoldTokenVaultContract.getTotalAvailableCash();
    const totalAvailableCashFloat = parseFloat(ethers.utils.formatUnits(totalAvailableCash, 6));
    console.log("[#DEBUG]: totalAvailableCashFloat", totalAvailableCashFloat);

    // Get max capacity
    const maxTotalDeposit: BigNumber = await manifoldTokenVaultContract.maxTotalDeposit();
    const maxTotalDepositFloat = parseFloat(ethers.utils.formatUnits(maxTotalDeposit, 6));
    console.log("[#DEBUG]: maxTotalDepositFloat", maxTotalDepositFloat);

    // Get blocknumber
    const blockNumber = await provider.getBlockNumber();
    console.log("[#DEBUG]: blockNumber", blockNumber);

    // Connect to postgresql
    const repository = connection.getRepository(VaultSnapshot);

    const cunieform = new VaultSnapshot();
    cunieform.contractAddress = vaultContractAddress;
    cunieform.borrowAPY = borrowAPY;
    cunieform.supplyAPY = supplyAPY;
    cunieform.totalAvailableCash = totalAvailableCashFloat;
    cunieform.totalOutstandingDebt = totalOutstandingDebtFloat;
    cunieform.utilizationRate = utilizationRatePercentage;
    cunieform.maxTotalDeposit = maxTotalDepositFloat;
    cunieform.blockNumber = blockNumber;
    await repository.save(cunieform);
}

export default {
    cunieform: cunieform,
};
