import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

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

const PlatformSidebar = ({ selectedPlatform }) => {
  const theme = useTheme();
  const colors = tokens;

  const [selected, setSelected] = useState(selectedPlatform || "Dashboard");

  return (
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
        "& .pro-inner-item.active": {
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
            icon={<HomeOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="WhatsApp"
            to="/platforms/whatsapp"
            icon={<AppsOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Telegram"
            to="/platforms/telegram"
            icon={<PeopleOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default PlatformSidebar;
