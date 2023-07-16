// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintHoneyToken is ERC721Enumerable, Ownable {
    uint constant public MAX_TOKEN_COUNT = 1000;    //발행량 제한
    uint constant public TOKEN_RANK_LENGTH = 4;
    uint constant public TOKEN_TYPE_LENGTH = 4;

    string public metadataURI;

    // 10^18 Peb = 1 Klay
    // 토큰 민팅 수수료
    uint public honeyTokenPrice = 1000000000000000000;

    // NFT 토큰 발행
    constructor(string memory _name, string memory _symbol, string memory _metadataURI) ERC721(_name, _symbol) {
        metadataURI = _metadataURI;
    }

    struct HoneyTokenData {
        uint honeyTokenRank;
        uint honeyTokenType;
    }

    mapping(uint => HoneyTokenData) public honeyTokenData; //랭크, 타입 출력

    uint[TOKEN_RANK_LENGTH][TOKEN_TYPE_LENGTH] public honeyTokenCount; 

    // 함수명 변경 불가
    function tokenURI(uint _tokenId) override public view returns(string memory) {
        string memory honeyTokenRank = Strings.toString(honeyTokenData[_tokenId].honeyTokenRank);
        string memory honeyTokenType = Strings.toString(honeyTokenData[_tokenId].honeyTokenType);

        return string(abi.encodePacked(metadataURI, '/', honeyTokenRank, '/', honeyTokenType, '.json'));
    }

    // 민팅
    function mintHoneyToken() public payable {
        require(honeyTokenPrice <= msg.value, "Klay is Short.");
        require(MAX_TOKEN_COUNT > totalSupply(), "No more minting is possible."); //발행량 제한

        uint tokenId = totalSupply() + 1;   // 총 NFT 발행량 확인

        HoneyTokenData memory randomTokenData = randomGenerator(msg.sender, tokenId);

        honeyTokenData[tokenId] = HoneyTokenData(randomTokenData.honeyTokenRank, randomTokenData.honeyTokenType);

        honeyTokenCount[randomTokenData.honeyTokenRank - 1][randomTokenData.honeyTokenType - 1] += 1;

        payable(owner()).transfer(msg.value);

        _mint(msg.sender, tokenId); //민팅(NFT발행자, 토큰ID)
    }

    // count, rank, type 리턴
    function getHoneyTokenCount() public view returns(uint[TOKEN_RANK_LENGTH][TOKEN_TYPE_LENGTH] memory) {
        return honeyTokenCount;
    }
    function getHoneyTokenRank(uint _tokenId) public view returns(uint) {
        return honeyTokenData[_tokenId].honeyTokenRank;
    }
    function getHoneyTokenType(uint _tokenId) public view returns(uint) {
        return honeyTokenData[_tokenId].honeyTokenType;
    }

    // 랜덤하게 꿀 결정 출력
    function randomGenerator(address _msgSender, uint _tokenId) private view returns(HoneyTokenData memory) {
        uint randomNum = uint(keccak256(abi.encodePacked(blockhash(block.timestamp), _msgSender, _tokenId))) % 100; //랜덤값 생성
        // uint randomNum = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp , participants.length ))) % 100;
        HoneyTokenData memory randomTokenData;

        // 확률표
        if (randomNum < 4) {
            if (randomNum == 0) {
                randomTokenData.honeyTokenRank = 1;
                randomTokenData.honeyTokenType = 1;
            } else if (randomNum == 1) {
                randomTokenData.honeyTokenRank = 1;
                randomTokenData.honeyTokenType = 2;
            } else if (randomNum == 2) {
                randomTokenData.honeyTokenRank = 1;
                randomTokenData.honeyTokenType = 3;
            } else {
                randomTokenData.honeyTokenRank = 1;
                randomTokenData.honeyTokenType = 4;
            }
        } else if (randomNum < 12) {
            if (randomNum < 6) {
                randomTokenData.honeyTokenRank = 2;
                randomTokenData.honeyTokenType = 1;
            } else if (randomNum < 8) {
                randomTokenData.honeyTokenRank = 2;
                randomTokenData.honeyTokenType = 2;
            } else if (randomNum < 10) {
                randomTokenData.honeyTokenRank = 2;
                randomTokenData.honeyTokenType = 3;
            } else {
                randomTokenData.honeyTokenRank = 2;
                randomTokenData.honeyTokenType = 4;
            }
        } else if (randomNum < 36) {
            if (randomNum < 18) {
                randomTokenData.honeyTokenRank = 3;
                randomTokenData.honeyTokenType = 1;
            } else if (randomNum < 24) {
                randomTokenData.honeyTokenRank = 3;
                randomTokenData.honeyTokenType = 2;
            } else if (randomNum < 30) {
                randomTokenData.honeyTokenRank = 3;
                randomTokenData.honeyTokenType = 3;
            } else {
                randomTokenData.honeyTokenRank = 3;
                randomTokenData.honeyTokenType = 4;
            }
        } else {
            if (randomNum < 52) {
                randomTokenData.honeyTokenRank = 4;
                randomTokenData.honeyTokenType = 1;
            } else if (randomNum < 68) {
                randomTokenData.honeyTokenRank = 4;
                randomTokenData.honeyTokenType = 2;
            } else if (randomNum < 84) {
                randomTokenData.honeyTokenRank = 4;
                randomTokenData.honeyTokenType = 3;
            } else {
                randomTokenData.honeyTokenRank = 4;
                randomTokenData.honeyTokenType = 4;
            }
        }

        return randomTokenData;
    }
}