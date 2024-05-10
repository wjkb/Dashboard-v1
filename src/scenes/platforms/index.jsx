import { Box } from "@mui/material";
import Header from "../../components/Header";
import PlatformSidebar from "./platformSidebar";

const Platforms = () => {
  return (
    <>
      <Box m="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="Platforms" subtitle="Choose the platform:" />
        </Box>
      </Box>
      <PlatformSidebar  />
    </>
  );
};

export default Platforms;
