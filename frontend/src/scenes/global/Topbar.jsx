import { Box, IconButton, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import AlertsMenu from "./AlertsMenu"; // Import the AlertsMenu component

/**
 * Topbar component for the application.
 *
 * @returns {JSX.Element} The topbar component.
 */
const Topbar = () => {
  const theme = useTheme();
  const colors = tokens;

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={2}
      backgroundColor="#6c1f98"
    >
      {/* SEARCH BAR */}
      <Box display="flex" backgroundColor={colors.grey[700]} borderRadius="3px">
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <AlertsMenu /> {/* Use the AlertsMenu component */}
        <IconButton type="button" sx={{ p: 1 }} aria-label="settings">
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton type="button" sx={{ p: 1 }} aria-label="profile">
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
