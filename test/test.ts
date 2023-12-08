import {ethers} from 'hardhat'
import '@nomicfoundation/hardhat-chai-matchers'
import {HardhatEthersSigner} from '@nomicfoundation/hardhat-ethers/signers'
import chai, {expect} from 'chai'
import chaiAsPromised from 'chai-as-promised'
import {Afrique} from '../typechain-types'

chai.use(chaiAsPromised)

describe('NFTsc Test', () => {
    let admin: HardhatEthersSigner,
        pauser: HardhatEthersSigner,
        minter: HardhatEthersSigner,
        artistAlpha: HardhatEthersSigner,
        contract: NFTsc

    before(async () => {
        ;[admin, pauser, minter] = await ethers.getSigners()
    })

    beforeEach(async () => {
        const NFTscFactory = await ethers.getContractFactory('NFTsc')
        contract = await NFTscFactory.deploy(admin, pauser, minter)
    })

    it('user profile should return false if it does not exist', async () => {
        const userAddress = await contract.connect(artistAlpha).getAddress()
        const doesUserProfileExist =
            await contract.userProfileExists(userAddress)
        expect(doesUserProfileExist).to.equal(false)
    })

    it('user profile should return true if it exist', async () => {
        const name = 'testName'
        const website = 'testWebsite'
        const displayPicture = 'displayPicture'
        const profileWallPaper = 'profileWallPaper'
        const bio = 'this is a test'

        const resp = await contract.createProfile(
            name,
            website,
            displayPicture,
            profileWallPaper,
            bio
        )

        const finalProfileExists = await contract.userProfileExists(resp.from)

        expect(finalProfileExists).to.equal(true)
    })

    it('artist with user profile can mint token', async () => {
        const connectedContract = contract.connect(minter)
        const tokenUri = 'https://example.com/metadata/token123.json'

        // Ensure the initial balance is 0
        const initialBalance = await contract.balanceOf(
            await minter.getAddress()
        )
        expect(initialBalance).to.equal(0)

        // Mint a new token with the given URI
        await expect(async () =>
            connectedContract.safeMint(
                await minter.getAddress(),
                ethers.toUtf8Bytes(tokenUri)
            )
        ).to.changeTokenBalance(connectedContract, minter, 1)

        // Ensure the final balance is 1
        const finalBalance = await connectedContract.balanceOf(
            await minter.getAddress()
        )
        expect(finalBalance).to.equal(1)
    })
})