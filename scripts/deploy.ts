/* eslint-disable no-console */
import {ethers, run} from 'hardhat'

async function main() {
    const accounts = await ethers.getSigners()
    const NFTscFactory = await ethers.getContractFactory('NFTsc')
    const address = accounts.map((a) => a.address)
    const NFTsc = await NFTscFactory.deploy(
        address[0],
        address[0],
        address[0]
    )

    await NFTsc.waitForDeployment()
    const NFTscAddress = await NFTsc.getAddress()
    console.log(
        `NFTsc deployed to: https://sepolia.etherscan.io/address/${NFTscAddress}`
    )

    console.log('Waiting 30 seconds before verifying the contract...')
    await sleep(30 * 1000)

    console.log('Verifying contract on Etherscan...')
    await run('verify:verify', {
        address: NFTscAddress,
        constructorArguments: [address[0], address[0], address[0]],
        network: 'sepolia'
    })
    console.log('Contract verified on Etherscan')
}

// Helper function to sleep for a specified number of milliseconds
function sleep(ms: number) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, ms))
}

/*
 * We recommend this pattern to be able to use async/await everywhere
 * and properly handle errors.
 */
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})