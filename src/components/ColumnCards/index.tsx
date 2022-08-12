import { BoardCardByIdT } from "@/types/trpc-queries";
import { Flex, HStack, IconButton, Tag, Text, Tooltip } from "@chakra-ui/react";
import Image from "next/image";
import { HiPlus } from "react-icons/hi";

type Props = {
  cards: BoardCardByIdT[];
};

const ColumnCards = ({ cards }: Props) => {
  return (
    <>
      {cards.map(({ id, name, labels, cover }) => (
        <Flex
          key={id}
          bg="white"
          direction="column"
          p="3"
          rounded="xl"
          shadow="base"
          gap="3"
        >
          {cover && (
            <Flex position="relative" h="130px" w="220px">
              <Image src={cover} alt={name} layout="fill" objectFit="cover" />
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
      ))}
    </>
  );
};

export default ColumnCards;
