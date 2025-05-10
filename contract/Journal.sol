// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BuilderJournalNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(address => uint256) public lastMintTime;
    mapping(uint256 => address) public tokenMinters;
    uint256[] public allTokenIds;

    event JournalEntryCreated(uint256 indexed tokenId, address indexed builder, string entryURI);

    constructor() ERC721("Builder Journal", "BJOURNAL") Ownable(msg.sender) {}

    function createJournalEntry(string memory entryURI) public returns (uint256) {
        require(canMintToday(msg.sender), "You can only mint one journal entry per day");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, entryURI);

        lastMintTime[msg.sender] = block.timestamp;
        tokenMinters[newTokenId] = msg.sender;
        allTokenIds.push(newTokenId);

        emit JournalEntryCreated(newTokenId, msg.sender, entryURI);

        return newTokenId;
    }


    function getTotalEntries() public view returns (uint256) {
        return _tokenIds.current();
    }

  
    function getAllEntries() public view returns (uint256[] memory, address[] memory) {
        uint256 total = allTokenIds.length;
        address[] memory minters = new address[](total);

        for (uint256 i = 0; i < total; i++) {
            minters[i] = tokenMinters[allTokenIds[i]];
        }

        return (allTokenIds, minters);
    }

    function canMintToday(address user) public view returns (bool) {
        return block.timestamp >= lastMintTime[user] + 1 days;
    }
}
