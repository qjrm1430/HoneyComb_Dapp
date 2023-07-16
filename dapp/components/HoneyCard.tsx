import { Box, Image, Text } from "@chakra-ui/react";
import { FC } from "react";

import { HoneyTokenMetadata } from "../interfaces";

interface HoneyCardProps {
  metadataURI: HoneyTokenMetadata | undefined;
}

const HoneyCard: FC<HoneyCardProps> = ({ metadataURI }) => {
  return (
    <Box fontSize="sm" mb={2}>
      <Image
        src={metadataURI?.image}
        fallbackSrc="images/loading.png"
        alt="Honey"
      />
      <Text>{metadataURI?.name}</Text>
      <Text>{metadataURI?.description}</Text>
    </Box>
  );
};

export default HoneyCard;
