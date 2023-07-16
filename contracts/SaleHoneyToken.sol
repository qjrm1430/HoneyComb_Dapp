// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./MintHoneyToken.sol";

contract SaleHoneyToken {
    MintHoneyToken public mintHoneyToken;

    // 받아오기
    constructor(address _mintHoneyToken) {
        mintHoneyToken = MintHoneyToken(_mintHoneyToken);
    }

    struct HoneyTokenData {
        uint tokenId;
        uint honeyTokenRank;
        uint honeyTokenType;
        uint tokenPrice;
    }

    mapping(uint => uint) public tokenPrices;   // 가격 맵핑

    uint[] public onSaleTokens;

    // 판매 등록 함수
    function setForSaleHoneyToken(uint _tokenId, uint _price) public {
        address tokenOwner = mintHoneyToken.ownerOf(_tokenId);

        require(tokenOwner == msg.sender, "Caller is not Honey token owner.");
        require(_price > 0, "Price is zero or lower.");
        require(tokenPrices[_tokenId] == 0, "This Honey token is already on sale.");
        require(mintHoneyToken.isApprovedForAll(msg.sender, address(this)), "Honey token onwer did not approve token.");
        /*
        1. 소유자인지 확인 (소유자민 구매 O)
        2. 가격이 0보다 낮은지
        3. 판매 중인지 확인
        4. 판매 권한 확인
        */
        tokenPrices[_tokenId] = _price;

        onSaleTokens.push(_tokenId);
    }
    
    // 구매 함수    
    function purchaseHoneyToken(uint _tokenId) public payable {
        address tokenOwner = mintHoneyToken.ownerOf(_tokenId);

        require(tokenOwner != msg.sender, "Caller is Honey token owner.");
        require(tokenPrices[_tokenId] > 0, "This Honey token not sale.");
        require(tokenPrices[_tokenId] <= msg.value, "Caller sent lower than price.");
        /*
        1. 소유자인지 확인 (소유자는 구매 X)
        2. 판매중인지 확인
        3. 판매 금액보다 적은지
        */

        payable(tokenOwner).transfer(msg.value); //입력 KLAY 송금

        mintHoneyToken.safeTransferFrom(tokenOwner, msg.sender, _tokenId);

        tokenPrices[_tokenId] = 0; //판매종료

        popOnSaleToken(_tokenId);
    }

    // 판매된 NFT 제외 함수
    function popOnSaleToken(uint _tokenId) private {
        for(uint i = 0; i < onSaleTokens.length; i++) {
            if(onSaleTokens[i] == _tokenId) {
                onSaleTokens[i] = onSaleTokens[onSaleTokens.length - 1];
                onSaleTokens.pop();
            }
        }
    }

    // 계좌 NFT 조회 함수
    function getHoneyTokens(address _tokenOwner) public view returns(HoneyTokenData[] memory) {
        uint balanceLength = mintHoneyToken.balanceOf(_tokenOwner);

        require(balanceLength > 0, "Token owner did not have token."); //계좌에 NFT가 없을 때

        HoneyTokenData[] memory honeyTokens = new HoneyTokenData[](balanceLength);

        for(uint i = 0; i < balanceLength; i++) {
            uint tokenId = mintHoneyToken.tokenOfOwnerByIndex(_tokenOwner, i); // NFT 아이디 조회
            
            (uint honeyTokenRank, uint honeyTokenType, uint tokenPrice) = getHoneyTokenInfo(tokenId);

            honeyTokens[i] = HoneyTokenData(tokenId, honeyTokenRank, honeyTokenType, tokenPrice);
        }

        return honeyTokens;
    }

    // 판매중인 NFT 조회 함수
    function getSaleHoneyTokens() public view returns(HoneyTokenData[] memory) {
        require(onSaleTokens.length > 0, "Not exist on sale token."); //판매중인 NFT가 없을 때

        HoneyTokenData[] memory honeyTokens = new HoneyTokenData[](onSaleTokens.length);

        for(uint i = 0; i < onSaleTokens.length; i++) {
            uint tokenId = onSaleTokens[i];

            (uint honeyTokenRank, uint honeyTokenType, uint tokenPrice) = getHoneyTokenInfo(tokenId);

            honeyTokens[i] = HoneyTokenData(tokenId, honeyTokenRank, honeyTokenType, tokenPrice);
        }

        return honeyTokens;
    }

    // 마지막 민팅 NFT 조회 함수
    function getLatestMintedHoneyToken(address _tokenOwner) public view returns(HoneyTokenData memory) {
        uint balanceLength = mintHoneyToken.balanceOf(_tokenOwner);

        uint tokenId = mintHoneyToken.tokenOfOwnerByIndex(_tokenOwner, balanceLength - 1);

        (uint honeyTokenRank, uint honeyTokenType, uint tokenPrice) = getHoneyTokenInfo(tokenId);

        return HoneyTokenData(tokenId, honeyTokenRank, honeyTokenType, tokenPrice);
    }

    // 토큰 조회 함수
    function getHoneyTokenInfo(uint _tokenId) public view returns(uint, uint, uint) {
        uint honeyTokenRank = mintHoneyToken.getHoneyTokenRank(_tokenId);
        uint honeyTokenType = mintHoneyToken.getHoneyTokenType(_tokenId);
        uint tokenPrice = tokenPrices[_tokenId];

        return (honeyTokenRank, honeyTokenType, tokenPrice);
    } 
}