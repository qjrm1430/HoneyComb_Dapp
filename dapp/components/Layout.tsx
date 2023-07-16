import { Box } from "@chakra-ui/react";
import { FC, ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <Box>
      <Header />
      {children}
    </Box>
  );
};

export default Layout;
