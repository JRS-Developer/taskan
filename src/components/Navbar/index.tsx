import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  VisuallyHidden,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import { HiAdjustments, HiChevronDown, HiOutlineLogout } from "react-icons/hi";

const Navbar = () => {
  const { data } = useSession();

  return (
    <Flex as="nav" py="4" px="8" bg="gray.900" shadow="xl">
      <Heading as="h1">Taskan</Heading>

      <Spacer />

      <Flex gap="12">
        <FormControl display="flex" gap="1">
          <VisuallyHidden>
            <FormLabel>Search Boards</FormLabel>
          </VisuallyHidden>
          <Input placeholder="keyword..." />
          <Button>Search</Button>
        </FormControl>

        <Flex>
          <Menu>
            <MenuButton
              as={Button}
              align="center"
              variant="ghost"
              leftIcon={
                <Avatar
                  size="xs"
                  name={data?.user?.name || undefined}
                  src={data?.user?.image || undefined}
                />
              }
              rightIcon={<HiChevronDown />}
            >
              <Text h="full" as="span">
                {data?.user?.name}
              </Text>
            </MenuButton>

            <MenuList>
              <MenuItem icon={<HiAdjustments />}>Settings</MenuItem>
              <MenuItem icon={<HiOutlineLogout />} onClick={() => signOut()}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Navbar;
