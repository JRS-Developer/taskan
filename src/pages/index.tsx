import Head from "next/head";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { HiPlus } from "react-icons/hi";
import { trpc } from "@/utils/trpc";
import CreateBoardModal from "@/components/Modals/CreateBoardModal";
import BoardList from "@/components/BoardList";

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    data: boards,
    isLoading,
    isSuccess,
  } = trpc.useQuery(["boards.getAll"]);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box px="40" pt="12">
        <Flex justify="space-between" mb="8" align="center">
          <Heading size="md">All Boards</Heading>
          <Button leftIcon={<HiPlus />} onClick={onOpen} colorScheme="blue">
            Add
          </Button>
        </Flex>

        <CreateBoardModal isOpen={isOpen} onClose={onClose} />

        <Flex gap="8">
          {isLoading && "Loading..."}
          {isSuccess && <BoardList boards={boards} w="full" />}
        </Flex>
      </Box>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session?.user) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session: session,
    },
  };
};

export default Home;
