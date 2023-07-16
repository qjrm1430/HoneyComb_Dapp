import {
  Box,
  Button,
  Flex,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import MintingModal from "../components/MintingModal";
import { useCaver } from "../hooks";

const Home: NextPage = () => {
  const [remainHoneyTokens, setRemainHoneyTokens] = useState<number>(0);
  const [honeyTokenCount, setHoneyTokenCount] = useState<string[][] | undefined>(
    undefined
  );

  const { mintHoneyTokenContract } = useCaver();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const getRemainHoneyTokens = async () => {
    try {
      if (!mintHoneyTokenContract) return;

      const response = await mintHoneyTokenContract.methods.totalSupply().call();

      setRemainHoneyTokens(1000 - parseInt(response, 10));
    } catch (error) {
      console.error(error);
    }
  };
  const getHoneyTokenCount = async () => {
    try {
      if (!mintHoneyTokenContract) return;

      const response = await mintHoneyTokenContract.methods
        .getHoneyTokenCount()
        .call();

      setHoneyTokenCount(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRemainHoneyTokens();
    getHoneyTokenCount();
  }, [mintHoneyTokenContract]);

  return (
    <>
      <Flex
        pt={20}
        minH="100vh"
        alignItems="center"
        direction="column"
        textColor="gray.700"
      >
        <Text fontSize="4xl">16가지 종류의 꿀을 모아보세요</Text>
        <Text mb={8} fontSize="2xl" color="blue.400">
          남은 꿀 : {remainHoneyTokens}
        </Text>
        <TableContainer mb={8}>
          <Table>
            <Thead bgColor="gray.500">
              <Tr>
                <Th textColor="gray.700">랭크\종류</Th>
                <Th>
                  <Image w={6} borderRadius="sm" src="images/t1.png" alt="1" />
                </Th>
                <Th>
                  <Image w={6} borderRadius="sm" src="images/t2.png" alt="2" />
                </Th>
                <Th>
                  <Image w={6} borderRadius="sm" src="images/t3.png" alt="3" />
                </Th>
                <Th>
                  <Image w={6} borderRadius="sm" src="images/t4.png" alt="4" />
                </Th>
              </Tr>
            </Thead>
            {honeyTokenCount?.map((v, i) => {
              return (
                <Tbody key={i} bgColor={`gray.${400 - i * 100}`}>
                  <Tr>
                    <Td textAlign="center" fontSize="xs" fontWeight="bold">
                      랭크 {i + 1}
                    </Td>
                    {v.map((w, j) => {
                      return (
                        <Td key={j} textAlign="center">
                          {w}
                        </Td>
                      );
                    })}
                  </Tr>
                </Tbody>
              );
            })}
          </Table>
        </TableContainer>

        <Button colorScheme="blue" onClick={onOpen}>
          민팅하기
        </Button>
      </Flex>
      <MintingModal
        isOpen={isOpen}
        onClose={onClose}
        getRemainHoneyTokens={getRemainHoneyTokens}
        getHoneyTokenCount={getHoneyTokenCount}
      />
    </>
  );
};

export default Home;
