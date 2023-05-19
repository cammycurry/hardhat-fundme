import { HardhatRuntimeEnvironment } from "hardhat/types"
import { developmentChains, networkConfig } from "../helper-hardhat-config"
import { network } from "hardhat"
import { verify } from "../utils/verify"

module.exports = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId: number | undefined = network.config.chainId

    if (chainId === undefined) {
        throw new Error("Undefined chainId")
    }

    let ethUsdPriceFeed
    let waitConfirmation
    if (developmentChains.includes(network.name)) {
        waitConfirmation = 0
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeed = ethUsdAggregator.address
    } else {
        waitConfirmation = 6
        ethUsdPriceFeed = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    console.log("ethUsdPriceFeed", ethUsdPriceFeed)
    const args = [ethUsdPriceFeed]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitConfirmation,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }

    log("-----------------------------------------------------")
}
module.exports.tags = ["all", "fundme"]
