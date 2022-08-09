import { trpc } from "@/utils/trpc";
import { Box, Button, Flex, Menu, MenuButton } from "@chakra-ui/react";
import { NextPage } from "next";
import { NextRouter, withRouter } from "next/router";
import { HiDotsHorizontal, HiLockClosed } from "react-icons/hi";

type Props = {
  router: NextRouter;
};

const BoardPage: NextPage<Props> = ({ router }) => {
  const { query } = router;

  const boardId = query?.id as string;

  const { data, isLoading } = trpc.useQuery(
    [
      "boards.getOneById",
      {
        id: boardId,
      },
    ],
    {
      enabled: query.id !== undefined,
    }
  );

  console.log(data);

  return (
    <Box bg="gray.50">
      <Flex align="center" justify="space-between">
        <Flex align="center">
          <Menu>
            <MenuButton as={Button} leftIcon={<HiLockClosed />}>
              Private
            </MenuButton>
          </Menu>
          members
        </Flex>

        <Menu>
          <MenuButton as={Button} leftIcon={<HiDotsHorizontal />}>
            Show Menu
          </MenuButton>
        </Menu>
      </Flex>

      <Box bg="gray.100" rounded="lg"></Box>
    </Box>
  );
};

export default withRouter(BoardPage);
