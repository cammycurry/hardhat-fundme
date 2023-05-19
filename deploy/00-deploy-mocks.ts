import { HardhatRuntimeEnvironment } from "hardhat/types"
import { network } from "hardhat"
import {
    developmentChains,
    DECIMALS,
    INITIAL_PRICE,
} from "../helper-hardhat-config"

module.exports = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId: number | undefined = network.config.chainId

    if (chainId === undefined) {
        throw new Error("Undefined chainId")
    }

    if (developmentChains.includes(network.name)) {
        log("Using Mocks")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            args: [DECIMALS, INITIAL_PRICE],
            log: true,
        })
        log("Deployed mock aggregator")
        log("-----------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
