import { useCardModalStore } from "@/store";
import { CardByIdT } from "@/types/trpc-queries";
import { trpc } from "@/utils/trpc";
import {
  Box,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";

interface CardModalBodyProps {
  card: CardByIdT;
}

const CardModalBody = ({ card }: CardModalBodyProps) => {
  return (
    <Flex direction="column">
      {card?.cover && (
        <Box w="600px" h="110px" position="relative">
          <Image
            src={card.cover}
            layout="fill"
            alt={card.name}
            objectFit="cover"
          />
        </Box>
      )}
      <Flex gap="6" w="100%">
        <Box>
          <Box>
            <Heading as="h4" size="md" fontWeight="normal">
              {card.name}
            </Heading>
            <Text
              as="span"
              display="inline-block"
              mt="6px"
              fontSize="xs"
              color="gray.500"
            >
              In list{" "}
              <Text as="b" color="black" fontWeight="semiBold">
                {card.boardList.name}
              </Text>
            </Text>
          </Box>
        </Box>

        <Box></Box>
      </Flex>
    </Flex>
  );
};

const CardInfoModal = () => {
  const { cardId, isOpen, close } = useCardModalStore();
  const {
    data: card,
    isLoading,
    isSuccess,
  } = trpc.useQuery(["cards.getOneById", { id: cardId ?? "" }], {
    enabled: cardId !== undefined,
  });

  card && console.log(card);

  return (
    <>
      <Modal isOpen={isOpen} onClose={close}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />

          <ModalBody p="6">
            {isLoading && "Loading..."}
            {isSuccess && <CardModalBody card={card} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CardInfoModal;
