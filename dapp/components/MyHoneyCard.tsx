import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { SALE_HONEY_TOKEN_ADDRESS } from "../caverConfig";
import { useAccount, useCaver, useMetadata } from "../hooks";
import { HoneyTokenData } from "../interfaces";
import HoneyCard from "./HoneyCard";

export interface MyHoneyCardProps {
  honeyTokenData: HoneyTokenData;
}

const MyHoneyCard: FC<MyHoneyCardProps> = ({ honeyTokenData }) => {
  const [sellPrice, setSellPrice] = useState<string>("");
  const [myHoneyPrice, setMyHoneyPrice] = useState<string>(honeyTokenData.tokenPrice);

  const { account } = useAccount();
  const { caver, saleHoneyTokenContract } = useCaver();
  const { metadataURI, getMetadata } = useMetadata();

  const onClickSell = async () => {
    try {
      if (!account || !caver || !saleHoneyTokenContract) return;

      const response = await caver.klay.sendTransaction({
        type: "SMART_CONTRACT_EXECUTION",
        from: account,
        to: SALE_HONEY_TOKEN_ADDRESS,
        gas: "3000000",
        data: saleHoneyTokenContract.methods
          .setForSaleHoneyToken(
            honeyTokenData.tokenId,
            caver.utils.convertToPeb(sellPrice, "KLAY")
          )
          .encodeABI(),
      });

      if (response.status) {
        setMyHoneyPrice(caver.utils.convertToPeb(sellPrice, "KLAY"));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMetadata(honeyTokenData.honeyTokenRank, honeyTokenData.honeyTokenType);
  }, []);

  // 판매
  return (
    <Box
      w={200}
      h="fit-content"
      my={2}
      bgColor="white"
      p={3}
      rounded="2xl"
      shadow="lg"
    >
      <HoneyCard metadataURI={metadataURI} />
      {myHoneyPrice === "0" ? (
        <Flex>
          <InputGroup size="sm">
            <Input
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
            />
            <InputRightAddon children="Klay" />
            </InputGroup>
          <Button size="sm" onClick={onClickSell} ml={2} colorScheme="yellow">
            판매
          </Button>
        </Flex>
      ) : (
        <Text>{caver?.utils.convertFromPeb(myHoneyPrice, "KLAY")} KLAY</Text>
      )}
    </Box>
  );
};

export default MyHoneyCard;
