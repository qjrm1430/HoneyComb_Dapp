import { Box, Button, Grid, Text } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { MINT_HONEY_TOKEN_ADDRESS, SALE_HONEY_TOKEN_ADDRESS } from "../caverConfig";
import MyHoneyCard from "../components/MyHoneyCard";
import { useAccount, useCaver } from "../hooks";
import { HoneyTokenData } from "../interfaces";

const MyHoneyz: FC = () => {
  const [myHoneyTokens, setMyHoneyTokens] = useState<HoneyTokenData[] | undefined>(
    undefined
  );
  const [saleStatus, setSaleStatus] = useState<boolean>(false);

  const { account } = useAccount();
  const { caver, mintHoneyTokenContract, saleHoneyTokenContract } = useCaver();

  const getHoneyTokens = async () => {
    try {
      if (!account || !saleHoneyTokenContract) return;

      const response = await saleHoneyTokenContract.methods
        .getHoneyTokens(account)
        .call();

      setMyHoneyTokens(response);
    } catch (error) {
      console.error(error);
    }
  };
  const getSaleStatus = async () => {
    try {
      if (!account || !mintHoneyTokenContract) return;

      const response = await mintHoneyTokenContract.methods
        .isApprovedForAll(account, SALE_HONEY_TOKEN_ADDRESS)
        .call();

      setSaleStatus(response);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickSaleStatusToggle = async () => {
    try {
      if (!account || !caver || !mintHoneyTokenContract) return;

      const response = await caver.klay.sendTransaction({
        type: "SMART_CONTRACT_EXECUTION",
        from: account,
        to: MINT_HONEY_TOKEN_ADDRESS,
        gas: "3000000",
        data: mintHoneyTokenContract.methods
          .setApprovalForAll(SALE_HONEY_TOKEN_ADDRESS, !saleStatus)
          .encodeABI(),
      });

      if (response.status) {
        setSaleStatus(!saleStatus);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getHoneyTokens();
  }, [account, saleHoneyTokenContract]);
  useEffect(() => {
    getSaleStatus();
  }, [account, mintHoneyTokenContract]);

  return (
    <Box p={12} minH="100vh">
      <Box py={4} textAlign="center">
        <Text d="inline-block">
          판매 상태 : {saleStatus ? "True" : "False"}
        </Text>
        <Button
          size="xs"
          ml={2}
          colorScheme={saleStatus ? "red" : "blue"}
          onClick={onClickSaleStatusToggle}
        >
          {saleStatus ? "Cancel" : "Approve"}
        </Button>
      </Box>
      <Grid
        templateColumns="repeat(4, 1fr)"
        py={4}
        maxW="container.lg"
        mx="auto"
        justifyItems="center"
      >
        {myHoneyTokens?.map((v, i) => {
          return <MyHoneyCard key={i} honeyTokenData={v} />;
        })}
      </Grid>
    </Box>
  );
};

export default MyHoneyz;
