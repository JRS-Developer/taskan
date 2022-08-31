import { useCardModalStore } from "@/store";
import { CardByIdT } from "@/types/trpc-queries";
import { trpc } from "@/utils/trpc";
import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import Image from "next/image";
import CardInfo from "./CardInfo";
import CardActions from "./CardActions";

interface CardModalBodyProps {
  card: CardByIdT;
}

const CardModalBody = ({ card }: CardModalBodyProps) => {
  console.log("card", card);
  return (
    <Flex direction="column">
      {card?.cover && (
        <Box
          w="600px"
          h="110px"
          position="relative"
          overflow="hidden"
          rounded="xl"
        >
          <Image
            src={card.cover.url}
            layout="fill"
            alt={card.cover?.description ?? card.name}
            objectFit="cover"
            placeholder="blur"
            blurDataURL={card?.cover.blur_hash ?? ""}
          />
        </Box>
      )}
      <Flex mt="6" gap="6" w="100%">
        <Box flex="4">
          <CardInfo card={card} />
        </Box>

        <Box flex="1">
          <CardActions cardId={card.id} />
        </Box>
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

  return (
    <>
      <Modal isOpen={isOpen} onClose={close}>
        <ModalOverlay />
        <ModalContent minW="660px">
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
