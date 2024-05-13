import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import { mockDataAllBots } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";

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

const FacebookBots = () => {
  const theme = useTheme();
  const colors = tokens;

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "persona",
      headerName: "Persona",
      flex: 1,
    },
    {
      field: "model",
      headerName: "Model",
      flex: 1,
    },
  ];

  const filteredData = mockDataAllBots.filter((bot) =>
    bot.platforms.includes("Facebook")
  );

  return (
    <Box margin="20px" width="50%">
      <Header title="Facebook Bots" subtitle="Managing Facebook Bots" />
      <Box height="75vh">
        <DataGrid rows={filteredData} columns={columns} />
      </Box>
    </Box>
  );
};

export default FacebookBots;
