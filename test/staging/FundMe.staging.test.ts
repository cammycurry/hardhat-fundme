import { ethers, getNamedAccounts, network } from "hardhat"
import { FundMe } from "../../typechain"
import { developmentChains } from "../../helper-hardhat-config"
import { assert } from "chai"

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe: FundMe
          let deployer: string
          const sendValue = ethers.utils.parseEther(".03")
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              fundMe = (await ethers.getContract("FundMe")) as FundMe
          })

          it("allows people to fund and withdraw", async function () {
              await fundMe.fund({ value: sendValue })
              await fundMe.withdraw()
              const endingBalance = await ethers.provider.getBalance(
                  fundMe.address
              )
              assert.equal(endingBalance.toString(), "0")
          })
      })
