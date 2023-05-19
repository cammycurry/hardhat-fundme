import { getNamedAccounts, ethers } from "hardhat"
import { FundMe } from "../typechain"

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMe = (await ethers.getContract("FundMe", deployer)) as FundMe
    console.log("Withdrawl...")
    const transactionResponse = await fundMe.withdraw()
    await transactionResponse.wait(1)
    console.log("Withdrawl complete!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
