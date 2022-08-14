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
import axios from "axios";
import Image from "next/image";
import { ChangeEvent } from "react";
import { HiPhotograph, HiTag, HiUserCircle } from "react-icons/hi";
import { useMutation } from "react-query";
import UnsplashPopover from "../Popover/UnsplashPopover";

interface CardModalBodyProps {
  card: CardByIdT;
}

const CardModalBody = ({ card }: CardModalBodyProps) => {
  const utils = trpc.useContext();

  const uploadImageMutation = useMutation(
    ["upload-image"],
    async (formD: FormData) => {
      const { data } = await axios.post<{ url: string }>(
        "/api/upload-image",
        formD
      );
      return data;
    }
  );

  const updateCard = trpc.useMutation(["cards.updateOne"], {
    onSuccess: (data) => {
      utils.setQueryData(["cards.getOneById", { id: card.id }], data);
    },
  });

  const handleCoverChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e?.target?.files;
    const image = files?.length ? files[0] : null;
    if (!image) return;

    const formD = new FormData();
    formD.append("image", image);

    // updload image, and get public url to be saved in database
    uploadImageMutation.mutate(formD, {
      onSuccess: (data) => {
        // save coverUrl in database
        updateCard.mutate({
          id: card.id,
          cover: data.url,
        });
      },
    });

    // reset input
    e.target.value = "";
  };

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
            />
            {/* <Button
              leftIcon={<HiPhotograph />}
              color="gray.500"
              as="label"
              _hover={{
                cursor: "pointer",
              }}
              isLoading={updateCard.isLoading}
            >
              Cover
              <input
                accept="image/*"
                type="file"
                hidden
                onChange={handleCoverChange}
              />
            </Button> */}
            <Button leftIcon={<HiTag />} color="gray.500">
              Labels
            </Button>
          </Flex>
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
