import BoardColumns from "@/components/BoardColumns";
import CardInfoModal from "@/components/Modals/CardInfoModal";
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

  // getting the board data
  const { data, isLoading, isSuccess } = trpc.useQuery(
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

  return (
    <Box bg="gray.50" px="var(--page-padding)">
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

      {isSuccess && <BoardColumns boardId={boardId} columns={data.lists} />}

      <CardInfoModal />
    </Box>
  );
};

export default withRouter(BoardPage);
