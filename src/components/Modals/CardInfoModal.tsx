import { type UnsplashPhotoT } from "@/types/trpc-queries";
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
  Icon,
  Button,
} from "@chakra-ui/react";
import Image from "next/image";
import { HiPhotograph, HiTag, HiUserCircle } from "react-icons/hi";
import UnsplashPopover from "../Popover/UnsplashPopover";

interface CardModalBodyProps {
  card: CardByIdT;
}

const CardActions = ({ card }: { card: CardByIdT }) => {
  const utils = trpc.useContext();

  const updateCardCover = trpc.useMutation(["cards.updateOne"], {
    onSuccess: (data) => {
      utils.setQueryData(["cards.getOneById", { id: card.id }], data);
    },
  });

  const changeCover = (photo: UnsplashPhotoT) => {
    const {
      urls: { full },
      blur_hash,
      description,
    } = photo;

    updateCardCover.mutate({
      id: card.id,
      cover: {
        description,
        blur_hash,
        url: full,
      },
    });
  };

  return (
    <Box flex="1">
      <Flex direction="column" gap="3">
        <Flex align="center" gap="1">
          <Icon as={HiUserCircle} boxSize="3" color="gray.500" />
          <Text as="span" color="gray.500" fontSize="xs">
            Actions
          </Text>
        </Flex>

        <UnsplashPopover
          popoverProps={{
            isLazy: true,
            placement: "bottom-start",
          }}
          triggerProps={{
            leftIcon: <HiPhotograph />,
            color: "gray.500",
            children: "Cover",
          }}
          onClickImage={changeCover}
          isLoading={updateCardCover.isLoading}
        />
        <Button leftIcon={<HiTag />} color="gray.500">
          Labels
        </Button>
      </Flex>
    </Box>
  );
};

const CardModalBody = ({ card }: CardModalBodyProps) => {
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
            src={card.cover}
            layout="fill"
            alt={card.name}
            objectFit="cover"
          />
        </Box>
      )}
      <Flex mt="6" gap="6" w="100%">
        <Box flex="4">
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

        <CardActions card={card} />
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
