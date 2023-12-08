import {DeployFunction} from 'hardhat-deploy/types'
import {HardhatRuntimeEnvironment} from 'hardhat/types'

const deployNFTsc: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const {deploy} = hre.deployments
    const {deployer} = await hre.getNamedAccounts()

    await deploy('NFTsc', {
        from: deployer,
        log: true,
        args: [deployer, deployer, deployer],
        waitConfirmations: 1
    })
}

export default deployNFTsc
deployNFTsc.tags = ['NFTsc']