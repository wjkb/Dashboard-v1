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

const WhatsappBotsSidebar = () => {
  const theme = useTheme();
  const colors = tokens;

  return (
    <h1>
      {" "}
      THIS IS USED TO TEST IF THIS 'WhatsappBotsSidebar' COMPONENT RENDERS{" "}
    </h1>
  );
};

export default WhatsappBotsSidebar;
