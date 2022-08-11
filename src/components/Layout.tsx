import { Box } from "@chakra-ui/react";
import Navbar from "./Navbar";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <Box flexDirection="column" display="flex" bg="gray.100">
        <Box as="header" h="5rem">
          <Navbar />
        </Box>
        <Box as="main" minH="calc(100vh - var(--header-height))">
          {children}
        </Box>
      </Box>
    </>
  );
};

export default Layout;
