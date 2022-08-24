import { Flex, HStack, IconButton, Tag, Text, Tooltip } from "@chakra-ui/react";
import Image from "next/image";
import { HiPlus } from "react-icons/hi";
import { BoardCardByIdT } from "@/types/trpc-queries";
import { useCardModalStore } from "@/store";

type Props = {
  card: BoardCardByIdT;
};

const ColumnCardItem = ({ card: { id, cover, name, labels } }: Props) => {
  const openModal = useCardModalStore((state) => state.open);

  return (
    <Flex
      key={id}
      bg="white"
      direction="column"
      p="3"
      rounded="xl"
      shadow="base"
      gap="3"
      onClick={() => openModal(id)}
      transition="box-shadow 0.2s"
      _hover={{
        cursor: "pointer",
        shadow: "md",
        transition: "box-shadow 0.2s",
      }}
    >
      {cover && (
        <Flex
          position="relative"
          h="130px"
          w="220px"
          rounded="xl"
          overflow="hidden"
        >
          <Image
            src={cover.url}
            alt={cover?.description ?? `${name} Cover`}
            layout="fill"
            objectFit="cover"
            placeholder="blur"
            blurDataURL={cover.blur_hash ?? ""}
          />
        </Flex>
      )}
      <Text size="md">{name}</Text>
      {labels.length > 0 && (
        <HStack>
          {labels.map(({ Label }) => (
            <Tag key={`${id}-${Label.id}`}>{Label.id}</Tag>
          ))}
        </HStack>
      )}
      <Flex>
        <Flex>
          <Tooltip label="Add member">
            <IconButton
              icon={<HiPlus />}
              aria-label="Add member"
              colorScheme="blue"
              size="sm"
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ColumnCardItem;
