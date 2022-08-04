import { Box } from "@chakra-ui/react";
import Navbar from "./Navbar";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <Box as="header">
        <Navbar />
      </Box>
      <Box as="main">{children}</Box>
    </>
  );
};

export default Layout;
