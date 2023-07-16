export interface HoneyTokenData {
  tokenId: string;
  honeyTokenRank: string;
  honeyTokenType: string;
  tokenPrice: string;
}

export interface HoneyTokenMetadata {
  name: string;
  description: string;
  image: string;
  attributes: [
    { 0: { trait_type: "Rank"; value: number } },
    { 1: { trait_type: "Type"; value: number } }
  ];
}
