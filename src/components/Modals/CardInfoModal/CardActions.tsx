import { CardByIdT } from "@/types/trpc-queries";
import { trpc } from "@/utils/trpc";
import { Flex, Text, Icon, Button } from "@chakra-ui/react";
import { HiPhotograph, HiTag, HiUserCircle } from "react-icons/hi";
import UnsplashPopover from "@/components/Popover/UnsplashPopover";
import { type UnsplashPhotoT } from "@/types/trpc-queries";
import useSetCardQueryData from "@/hooks/setQueryData/useSetCardQueryData";

interface Props {
  cardId: CardByIdT["id"];
}

const CardActions = ({ cardId }: Props) => {
  const { setQueryData } = useSetCardQueryData(cardId);

  const updateCardCover = trpc.useMutation(["cards.updateOne"], {
    onSuccess: (data) => {
      setQueryData(data);
    },
  });

  const changeCover = (photo: UnsplashPhotoT) => {
    const {
      urls: { regular },
      blur_hash,
      description,
    } = photo;

    updateCardCover.mutate({
      id: cardId,
      cover: {
        description: description ?? undefined,
        blur_hash: blur_hash ?? undefined,
        url: regular,
      },
    });
  };

  return (
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
  );
};

export default CardActions;
