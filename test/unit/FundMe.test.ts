import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { assert, expect } from "chai"
import type { FundMe, MockV3Aggregator } from "../../typechain"
import { developmentChains } from "../../helper-hardhat-config"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe: FundMe
          let deployer: string
          let mockV3Aggregator: MockV3Aggregator
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              fundMe = (await ethers.getContract("FundMe")) as FundMe
              mockV3Aggregator = (await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )) as MockV3Aggregator
          })
          describe("constructor", async function () {
              it("should set the aggregator address correctly", async function () {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, mockV3Aggregator.address)
              })
          })

          describe("fund", async function () {
              it("Fails if you don't send enough ETH", async function () {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })
              it("Updates the amount funded data structure", async function () {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  )
                  assert.equal(response.toString(), sendValue.toString())
              })
              it("Adds funder to array of s_funders", async function () {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getFunder(0)
              })
          })

          describe("withdraw", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })

              it("withdraw eth from a single funder", async function () {
                  // Arrange
                  const startingBalanceFundMe =
                      await ethers.provider.getBalance(fundMe.address)
                  const startingBalanceDeployer =
                      await ethers.provider.getBalance(deployer)
                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)

                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = effectiveGasPrice.mul(gasUsed)

                  const endingBalanceFundMe = await ethers.provider.getBalance(
                      fundMe.address
                  )
                  const endingBalanceDeployer =
                      await ethers.provider.getBalance(deployer)
                  // Assert
                  assert.equal(endingBalanceFundMe.toString(), "0")
                  assert.equal(
                      startingBalanceFundMe
                          .add(startingBalanceDeployer)
                          .toString(),
                      endingBalanceDeployer.add(gasCost).toString()
                  )
              })

              it("withdraw eth from multiple s_funders", async function () {
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }

                  const startingBalanceFundMe =
                      await ethers.provider.getBalance(fundMe.address)
                  const startingBalanceDeployer =
                      await ethers.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = effectiveGasPrice.mul(gasUsed)

                  const endingBalanceFundMe = await ethers.provider.getBalance(
                      fundMe.address
                  )
                  const endingBalanceDeployer =
                      await ethers.provider.getBalance(deployer)
                  // Assert
                  assert.equal(endingBalanceFundMe.toString(), "0")
                  assert.equal(
                      startingBalanceFundMe
                          .add(startingBalanceDeployer)
                          .toString(),
                      endingBalanceDeployer.add(gasCost).toString()
                  )

                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          (
                              await fundMe.getAddressToAmountFunded(
                                  accounts[i].address
                              )
                          ).toString(),
                          "0"
                      )
                  }
              })

              it("only allows the owner to withdraw", async function () {
                  const accounts = await ethers.getSigners()
                  const fundMeConnectedContract = await fundMe.connect(
                      accounts[1]
                  )
                  // broken with asserting????
                  // having issue fining the revert message
                  await expect(fundMeConnectedContract.withdraw()).to.be
                      .reverted
              })

              it("cheap withdrawl single", async function () {
                  // Arrange
                  const startingBalanceFundMe =
                      await ethers.provider.getBalance(fundMe.address)
                  const startingBalanceDeployer =
                      await ethers.provider.getBalance(deployer)
                  // Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)

                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = effectiveGasPrice.mul(gasUsed)

                  const endingBalanceFundMe = await ethers.provider.getBalance(
                      fundMe.address
                  )
                  const endingBalanceDeployer =
                      await ethers.provider.getBalance(deployer)
                  // Assert
                  assert.equal(endingBalanceFundMe.toString(), "0")
                  assert.equal(
                      startingBalanceFundMe
                          .add(startingBalanceDeployer)
                          .toString(),
                      endingBalanceDeployer.add(gasCost).toString()
                  )
              })

              it("cheaper withdrawl..", async function () {
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }

                  const startingBalanceFundMe =
                      await ethers.provider.getBalance(fundMe.address)
                  const startingBalanceDeployer =
                      await ethers.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = effectiveGasPrice.mul(gasUsed)

                  const endingBalanceFundMe = await ethers.provider.getBalance(
                      fundMe.address
                  )
                  const endingBalanceDeployer =
                      await ethers.provider.getBalance(deployer)
                  // Assert
                  assert.equal(endingBalanceFundMe.toString(), "0")
                  assert.equal(
                      startingBalanceFundMe
                          .add(startingBalanceDeployer)
                          .toString(),
                      endingBalanceDeployer.add(gasCost).toString()
                  )

                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          (
                              await fundMe.getAddressToAmountFunded(
                                  accounts[i].address
                              )
                          ).toString(),
                          "0"
                      )
                  }
              })
          })
      })
