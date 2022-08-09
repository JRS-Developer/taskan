import { trpc, inferQueryOutput } from "@/utils/trpc";
import {
  Avatar,
  AvatarGroup,
  Box,
  Heading,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import NextLink from "next/link";
import DefaultCover from "@/assets/images/default_board_cover.jpg";

type Props = {
  board: inferQueryOutput<"boards.getAll">[0];
};

const BoardCard = ({ board }: Props) => {
  const { title, id, cover, isPrivate, creator, creatorId, members } = board;
  const { data } = useSession();

  // members without the same user
  const membersNoHimself = members.filter(
    (member) => member.User.id !== data?.user?.id
  );

  return (
    <LinkBox
      transition="transform 0.2s"
      shadow="md"
      bg="gray.50"
      p="4"
      rounded="lg"
      _hover={{
        transform: "scale(1.02)",
        transition: "transform 0.2s",
      }}
    >
      <Box
        w="full"
        h="120px"
        rounded="lg"
        overflow="hidden"
        position="relative"
      >
        <Image
          src={cover ?? DefaultCover}
          alt={title}
          objectFit="cover"
          layout="fill"
        />
      </Box>

      <Heading size="md" mt="2" fontWeight="medium">
        <NextLink href={`/${board.id}`} passHref>
          <LinkOverlay>{title}</LinkOverlay>
        </NextLink>
      </Heading>

      <AvatarGroup max={3} mt="4" size="sm">
        <Avatar
          src={creator.image || undefined}
          key={creator.id}
          name={creator.name || undefined}
        />
        {membersNoHimself.map(({ User: member }) => (
          <Avatar
            src={member.image || undefined}
            key={member.id}
            name={member.name || undefined}
          />
        ))}
      </AvatarGroup>
    </LinkBox>
  );
};

export default BoardCard;
