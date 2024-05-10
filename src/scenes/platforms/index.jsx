import Header from "../../components/Header";
import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

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

  const [selected, setSelected] = useState(null);

  return (
    <>
      <Box m="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="Platforms" subtitle="Choose the platform:" />
        </Box>
      </Box>
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
        <ProSidebar>
          <Menu iconShape="square">
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
    </>
  );
};

export default PlatformSidebar;
