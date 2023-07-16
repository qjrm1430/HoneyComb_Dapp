import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { SALE_HONEY_TOKEN_ADDRESS } from "../caverConfig";
import { useAccount, useCaver, useMetadata } from "../hooks";
import { HoneyTokenData } from "../interfaces";
import HoneyCard from "./HoneyCard";
import { MyHoneyCardProps } from "./MyHoneyCard";

interface SaleHoneyCardProps extends MyHoneyCardProps {
  getSaleHoneyTokens: () => Promise<void>;
  setSaleHoneyTokens: Dispatch<SetStateAction<HoneyTokenData[] | undefined>>;
}

const SaleHoneyCard: FC<SaleHoneyCardProps> = ({
  honeyTokenData,
  getSaleHoneyTokens,
  setSaleHoneyTokens,
}) => {
  const { account } = useAccount();
  const { caver, saleHoneyTokenContract } = useCaver();
  const { metadataURI, getMetadata } = useMetadata();

  const onClickBuy = async () => {
    try {
      if (!account || !caver || !saleHoneyTokenContract) return;

      const response = await caver.klay.sendTransaction({
        type: "SMART_CONTRACT_EXECUTION",
        from: account,
        to: SALE_HONEY_TOKEN_ADDRESS,
        gas: "3000000",
        data: saleHoneyTokenContract.methods
          .purchaseHoneyToken(honeyTokenData.tokenId)
          .encodeABI(),
        value: honeyTokenData.tokenPrice,
      });

      if (response.status) {
        setSaleHoneyTokens(undefined);
        getSaleHoneyTokens();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMetadata(honeyTokenData.honeyTokenRank, honeyTokenData.honeyTokenType);
  }, []);

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
      <Flex alignItems="center" justifyContent="space-between">
        <Text d="inline-block" fontSize="sm" pt={2}>
          {caver?.utils.convertFromPeb(honeyTokenData.tokenPrice, "KLAY")} KLAY
        </Text>
        <Button size="sm" mt={2} onClick={onClickBuy}>
          구매
        </Button>
      </Flex>
    </Box>
  );
};

export default SaleHoneyCard;
