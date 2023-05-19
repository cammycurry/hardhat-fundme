interface NetworkConfig {
    name: string
    ethUsdPriceFeed: string
}

interface NetworkConfigMap {
    [chainId: number]: NetworkConfig
}

export const developmentChains = ["localhost", "hardhat"]
export const DECIMALS = 8
export const INITIAL_PRICE = 200000000000

export const networkConfig: NetworkConfigMap = {
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
    137: {
        name: "polygon",
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    },
}
