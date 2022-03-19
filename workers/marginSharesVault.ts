import { BigNumber, ethers } from "ethers";
import { Connection } from "typeorm";
import { SlurpProfitsSnapshot } from "../entities/SlurpProfitsSnapshot";

import { VaultABI, ERC20ABI, OracleABI } from "./abi";

async function cunieform(vaultContractAddress: string, marginSharesVaultContractAddress: string, collateralDecimals: number, debtDecimals: number, provider: ethers.providers.JsonRpcProvider, connection: Connection) {
    // Initialize the contract
    const manifoldTokenVaultContract = new ethers.Contract(vaultContractAddress, VaultABI, provider);
    const marginSharesVaultContract = new ethers.Contract(marginSharesVaultContractAddress, ERC20ABI, provider);

    // Get collateral per margined token
    const collateralPerMarginOutstandingBN: BigNumber = await manifoldTokenVaultContract.getCollateralPerManifoldToken(marginSharesVaultContractAddress);
    const collateralPerMarginOutstanding = parseFloat(ethers.utils.formatUnits(collateralPerMarginOutstandingBN, collateralDecimals));
    console.log("[#DEBUG]: collateralPerMarginOutstanding", collateralPerMarginOutstanding);

    // Get debt per margined token
    const debtPerMarginOutstandingBN: BigNumber = await manifoldTokenVaultContract.getDebtPerManifoldToken(marginSharesVaultContractAddress);
    const debtPerMarginOutstanding = parseFloat(ethers.utils.formatUnits(debtPerMarginOutstandingBN, debtDecimals));
    console.log("[#DEBUG]: debtPerMarginOutstanding", debtPerMarginOutstanding);

    // Get leverage ratio in ether
    const leverageRatioBN: BigNumber = await manifoldTokenVaultContract.getLeverageRatioInEther(marginSharesVaultContractAddress);
    const leverageRatio = parseFloat(ethers.utils.formatEther(leverageRatioBN));
    console.log("[#DEBUG]: leverageRatio", leverageRatio);

    // Get nav price
    const navBN: BigNumber = await manifoldTokenVaultContract.getNAV(marginSharesVaultContractAddress);
    const nav = parseFloat(ethers.utils.formatUnits(navBN, debtDecimals));
    console.log("[#DEBUG]: nav", nav);

    // Get token metadata
    const metadata = await manifoldTokenVaultContract.getMetadata(marginSharesVaultContractAddress);
    const maxTotalCollateral = parseFloat(ethers.utils.formatUnits(metadata.maxTotalCollateral, collateralDecimals));
    console.log("[#DEBUG]: maxTotalCollateral", maxTotalCollateral);

    const totalCollateralPlusFee = parseFloat(ethers.utils.formatUnits(metadata.totalCollateralPlusFee, collateralDecimals));
    console.log("[#DEBUG]: totalCollateralPlusFee", totalCollateralPlusFee);

    const totalPendingFees = parseFloat(ethers.utils.formatUnits(metadata.totalPendingFees, collateralDecimals));
    console.log("[#DEBUG]: totalPendingFees", totalPendingFees);

    // Get oracle price
    const oracleContract = new ethers.Contract(metadata.oracleContract, OracleABI, provider);
    const collateralPriceBN: BigNumber = await oracleContract.getPrice();
    const collateralPrice = parseFloat(ethers.utils.formatUnits(collateralPriceBN, debtDecimals));
    console.log("[#DEBUG]: collateralPrice", collateralPrice);

    // Get total supply
    const totalSupplyBN: BigNumber = await marginSharesVaultContract.totalSupply();
    const totalSupply = parseFloat(ethers.utils.formatUnits(totalSupplyBN, collateralDecimals));
    console.log("[#DEBUG]: totalSupply", totalSupply);

    // Get outstanding debt
    const outstandingDebtBN: BigNumber = await manifoldTokenVaultContract.getOutstandingDebt(marginSharesVaultContractAddress);
    const outstandingDebt = parseFloat(ethers.utils.formatUnits(outstandingDebtBN, debtDecimals));
    console.log("[#DEBUG]: outstandingDebt", outstandingDebt);

    
    /**
     * @const blockNumber
     * @function getBlocknumber
     * @todo: This is a hack to get the blocknumber.
     */
    const blockNumber = await provider.getBlockNumber();
    console.log("[#DEBUG]: blockNumber", blockNumber);

    // Connect to postgresql
    const repository = connection.getRepository(SlurpProfitsSnapshot);

    /**
     * @SlurpProfitsSnapshot
     */
    const cunieform = new SlurpProfitsSnapshot();
    cunieform.contractAddress = marginSharesVaultContractAddress;
    cunieform.collateralPerMarginOutstanding = collateralPerMarginOutstanding;
    cunieform.debtPerMarginOutstanding = debtPerMarginOutstanding;
    cunieform.leverageRatio = leverageRatio;
    cunieform.nav = nav;
    cunieform.vaultContractAddress = vaultContractAddress;
    cunieform.totalSupply = totalSupply;
    cunieform.maxTotalCollateral = maxTotalCollateral;
    cunieform.totalCollateralPlusFee = totalCollateralPlusFee;
    cunieform.totalPendingFees = totalPendingFees;
    cunieform.outstandingDebt = outstandingDebt;
    cunieform.collateralPrice = collateralPrice;
    cunieform.blockNumber = blockNumber;
    await repository.save(cunieform);
}

export default {
    cunieform: cunieform,
};
