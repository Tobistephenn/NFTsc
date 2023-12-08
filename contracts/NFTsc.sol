// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract NFTsc is
    ERC721,
    ERC721Enumerable,
    ERC721Pausable,
    AccessControl,
    ERC721Burnable
{
    struct UserProfile {
        string name;
        string website;
        string displayPicture;
        string profileWallPapper;
        string bio;
        bool exists;
        uint256[] mintedTokens;
    }

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 private _nextTokenId;
    mapping(address => UserProfile) public userProfiles;

    modifier onlyExistingProfileOwners() {
        require(userProfiles[msg.sender].exists, "You don't have a profile");
        _;
    }

    modifier onlyProfileOwner(address profileAddress) {
        require(userProfiles[profileAddress].exists, "Profile does not exist");
        require(profileAddress == msg.sender, "Profile not yours");
        _;
    }

    constructor(
        address defaultAdmin,
        address pauser,
        address minter
    ) ERC721("NFTsc", "NSC") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, pauser);
        _grantRole(MINTER_ROLE, minter);
    }

    function createProfile(
        string memory name,
        string memory website,
        string memory displayPicture,
        string memory profileWallPapper,
        string memory bio
    ) external {
        require(!userProfiles[msg.sender].exists, "Profile already exists");

        userProfiles[msg.sender] = UserProfile(
            name,
            website,
            displayPicture,
            profileWallPapper,
            bio,
            true,
            new uint256[](0)
        );
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function editProfile(
        string memory newName,
        string memory newWebsite,
        string memory newBio
    ) external onlyExistingProfileOwners {
        userProfiles[msg.sender].name = newName;
        userProfiles[msg.sender].website = newWebsite;
        userProfiles[msg.sender].bio = newBio;
    }

    function userProfileExists(
        address profileAddress
    ) external view returns (bool) {
        return userProfiles[profileAddress].exists;
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function safeMint(address to, bytes memory tokenUri) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId, tokenUri);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
        internal
        override(ERC721, ERC721Enumerable, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }
}