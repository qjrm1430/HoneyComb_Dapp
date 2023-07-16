import { Box, Grid } from "@chakra-ui/react";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import SaleHoneyCard from "../components/SaleHoneyCard";
import { useCaver } from "../hooks";
import { HoneyTokenData } from "../interfaces";

const Sale: NextPage = () => {
  const [saleHoneyTokens, setSaleHoneyTokens] = useState<
    HoneyTokenData[] | undefined
  >(undefined);

  const { saleHoneyTokenContract } = useCaver();

  const getSaleHoneyTokens = async () => {
    try {
      if (!saleHoneyTokenContract) return;

      const response = await saleHoneyTokenContract.methods
        .getSaleHoneyTokens()
        .call();

      setSaleHoneyTokens(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSaleHoneyTokens();
  }, [saleHoneyTokenContract]);

  return (
    <Grid
      px={12}
      py={16}
      minH="100vh"
      templateColumns="repeat(4, 1fr)"
      maxW="container.lg"
      mx="auto"
      justifyItems="center"
    >
      {saleHoneyTokens?.map((v, i) => {
        return (
          <SaleHoneyCard
            key={i}
            honeyTokenData={v}
            getSaleHoneyTokens={getSaleHoneyTokens}
            setSaleHoneyTokens={setSaleHoneyTokens}
          />
        );
      })}
    </Grid>
  );
};

export default Sale;
