import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsappIcon from "@mui/icons-material/WhatsApp";
import TelegramIcon from "@mui/icons-material/Telegram";

// Define platforms to avoid duplication
const platforms = [
  { name: "Facebook", icon: <FacebookIcon />, path: "/platforms/facebook" },
  { name: "WhatsApp", icon: <WhatsappIcon />, path: "/platforms/whatsapp" },
  { name: "Telegram", icon: <TelegramIcon />, path: "/platforms/telegram" },
];

/**
 * Menu item component for the sidebar.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.title - The title of the menu item.
 * @param {string} props.to - The route to navigate to when the item is clicked.
 * @param {JSX.Element} props.icon - The icon to display in the menu item.
 * @param {string} props.selected - The currently selected menu item.
 * @param {Function} props.setSelected - Function to set the currently selected menu item.
 * @returns {JSX.Element} The menu item component.
 */
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens;
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

/**
 * Sidebar component for the application.
 *
 * @returns {JSX.Element} The sidebar component.
 */
const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const location = useLocation();

  /**
   * Effect to set the selected menu item based on the current path.
   */
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setSelected("Dashboard");
    } else if (path.startsWith("/platforms")) {
      const platform = platforms.find((p) => path.startsWith(p.path));
      setSelected(platform ? platform.name : "Manage platforms");
    } else if (path.startsWith("/managebots")) {
      setSelected("Manage bots");
    } else if (path.startsWith("/manual-send")) {
      setSelected("Manual Send");
    } else if (path.startsWith("/addbot")) {
      setSelected("Add Bot");
    }
  }, [location.pathname]);

  /**
   * Function to resolve the path to the profile image.
   *
   * @returns {string} The resolved image path.
   */
  const resolveImagePath = () => {
    return `${process.env.PUBLIC_URL}/assets/user.png`;
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: theme.palette.primary.main + " !important",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#ff00fe !important",
        },
        "& .pro-menu-item.active": {
          color: "#ff00fe !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  SCAMBAIT 2.0
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile=user"
                  width="100px"
                  height="100px"
                  src={resolveImagePath()}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Ben
                </Typography>
                <Typography variant="h5" color={colors.greenAccent}>
                  Q Team
                </Typography>
              </Box>
            </Box>
          )}

          {/* MENU ITEMS */}
          <Item
            title="Dashboard"
            to="/"
            icon={<HomeOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <SubMenu
            title="Manage platforms"
            icon={<AppsOutlinedIcon />}
            style={{ color: colors.grey[100] }}
          >
            {platforms.map((platform) => (
              <Item
                key={platform.name}
                title={platform.name}
                to={platform.path}
                icon={platform.icon}
                selected={selected}
                setSelected={setSelected}
              />
            ))}
          </SubMenu>
          <Item
            title="Manage bots"
            to="/managebots"
            icon={<PeopleOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Manual Send"
            to="/manual-send"
            icon={<PersonOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Add Bot"
            to="/addbot"
            icon={<PersonOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
