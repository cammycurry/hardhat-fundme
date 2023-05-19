import { getNamedAccounts, ethers } from "hardhat"
import { FundMe } from "../typechain"

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMe = (await ethers.getContract("FundMe", deployer)) as FundMe
    console.log("Funding contract is at: ", fundMe.address)
    const transactionResponse = await fundMe.fund({
        value: ethers.utils.parseEther("0.3"),
    })
    await transactionResponse.wait(1)
    console.log("Funded contract!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
