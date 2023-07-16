import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { FC } from "react";
import { MINT_HONEY_TOKEN_ADDRESS } from "../caverConfig";
import { useAccount, useCaver, useMetadata } from "../hooks";
import { HoneyTokenData } from "../interfaces";
import HoneyCard from "./HoneyCard";

interface MintingModalProps {
  isOpen: boolean;
  onClose: () => void;
  getRemainHoneyTokens: () => Promise<void>;
  getHoneyTokenCount: () => Promise<void>;
}

// 민팅
const MintingModal: FC<MintingModalProps> = ({
  isOpen,
  onClose,
  getRemainHoneyTokens,
  getHoneyTokenCount,
}) => {
  const { account } = useAccount();
  const { caver, mintHoneyTokenContract, saleHoneyTokenContract } = useCaver();
  const { metadataURI, getMetadata } = useMetadata();

  const onClickMint = async () => {
    try {
      if (
        !account ||
        !caver ||
        !mintHoneyTokenContract ||
        !saleHoneyTokenContract
      ) {
        return;
      }

      // web3 contract
      //   const response = await mintHoneyTokenContract.methods.mintBmToken().send({
      //     from: account,
      //     value: caver.utils.convertToPeb(1, "KLAY"),
      //     gas: 3000000,
      //   });

      const response = await caver.klay.sendTransaction({
        type: "SMART_CONTRACT_EXECUTION",
        from: account,
        to: MINT_HONEY_TOKEN_ADDRESS,
        value: caver.utils.convertToPeb(1, "KLAY"),
        gas: "3000000",
        data: mintHoneyTokenContract.methods.mintHoneyToken().encodeABI(),
      });

      if (response.status) {
        const latestMintedHoneyToken: HoneyTokenData = await saleHoneyTokenContract.methods
          .getLatestMintedHoneyToken(account)
          .call();

        getMetadata(
          latestMintedHoneyToken.honeyTokenRank,
          latestMintedHoneyToken.honeyTokenType
        );
        getRemainHoneyTokens();
        getHoneyTokenCount();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>민팅하기</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {metadataURI ? (
            <Flex justifyContent="center">
              <Box w={200}>
                <HoneyCard metadataURI={metadataURI} />
              </Box>
            </Flex>
          ) : (
            <>
              <Text>민팅 하시겠습니까?</Text>
              <Text>(1 Klay가 필요합니다.)</Text>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" colorScheme="blue" onClick={onClickMint}>
            민팅하기
          </Button>
          <Button ml={2} onClick={onClose}>
            닫기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MintingModal;
