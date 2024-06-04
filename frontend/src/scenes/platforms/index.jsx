import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, Outlet, useLocation } from "react-router-dom";
import { tokens } from "../../theme";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

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

const PlatformSidebar = () => {
  const theme = useTheme();
  const colors = tokens;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState(null);
  const location = useLocation();

  // Function to determine the selected item based on the current path
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/platforms/facebook")) {
      setSelected("Facebook");
    } else if (path.startsWith("/platforms/whatsapp")) {
      setSelected("WhatsApp");
    } else if (path.startsWith("/platforms/telegram")) {
      setSelected("Telegram");
    }
  }, [location.pathname]);

  return (
    <Box display="flex" height="calc(100% - 68.56px)">
      <Box
        sx={{
          "& .pro-sidebar-inner": {
            background: "#53057e !important",
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
                  justifyContent="right"
                  alignItems="center"
                  ml="15px"
                >
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>

            {!isCollapsed && (
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Choose the platform:
              </Typography>
            )}

            {/* MENU ITEMS */}
            <Item
              title="Facebook"
              to="/platforms/facebook"
              icon={<FacebookOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="WhatsApp"
              to="/platforms/whatsapp"
              icon={<ForumOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Telegram"
              to="/platforms/telegram"
              icon={<SendOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Menu>
        </ProSidebar>
      </Box>
      <Box flex={1} height="100%">
        <Outlet />
      </Box>
    </Box>
  );
};

export default PlatformSidebar;
