import { run } from "hardhat"

export const verify = async (contractAddress: string, args: any[]) => {
    console.log("Verifying contract on etherscan")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e: any) {
        if (e.message.includes("Contract source code already verified")) {
            console.log(e.message)
        } else {
            console.log("Error verifying contract", e)
        }
    }
}
