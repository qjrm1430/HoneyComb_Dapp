import axios from "axios";
import Caver, { Contract } from "caver-js";
import { useEffect, useState } from "react";
import {
  MINT_HONEY_TOKEN_ABI,
  MINT_HONEY_TOKEN_ADDRESS,
  SALE_HONEY_TOKEN_ABI,
  SALE_HONEY_TOKEN_ADDRESS,
} from "../caverConfig";
import { HoneyTokenMetadata } from "../interfaces";

// Kaikas 계정 연동
export const useAccount = () => {
  const [account, setAccount] = useState<string>("");

  const getAccount = async () => {
    try {
      const accounts = await window.klaytn.enable();

      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };
  
  // kaikas 지갑 확인
  useEffect(() => {
    if (window.klaytn) {
      getAccount();
    }
  }, []);

  return { account };
};

// caver.js 연동
export const useCaver = () => {
  const [caver, setCaver] = useState<Caver | undefined>(undefined);
  const [mintHoneyTokenContract, setMintHoneyTokenContract] = useState<
    Contract | undefined
  >(undefined);
  const [saleHoneyTokenContract, setSaleHoneyTokenContract] = useState<
    Contract | undefined
  >(undefined);

  useEffect(() => {
    if (window.klaytn) {
      setCaver(new Caver(window.klaytn));
    }
  }, []);

  useEffect(() => {
    if (!caver) return;

    setMintHoneyTokenContract(
      caver.contract.create(MINT_HONEY_TOKEN_ABI, MINT_HONEY_TOKEN_ADDRESS)
    );
    setSaleHoneyTokenContract(
      caver.contract.create(SALE_HONEY_TOKEN_ABI, SALE_HONEY_TOKEN_ADDRESS)
    );
  }, [caver]);

  return { caver, mintHoneyTokenContract, saleHoneyTokenContract };
};

export const useMetadata = () => {
  const [metadataURI, setMetadataURI] = useState<HoneyTokenMetadata | undefined>(
    undefined
  );

  const getMetadata = async (honeyTokenRank: string, honeyTokenType: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_METADATA_URI}/${honeyTokenRank}/${honeyTokenType}.json`
      );

      setMetadataURI(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return { metadataURI, getMetadata };
};
