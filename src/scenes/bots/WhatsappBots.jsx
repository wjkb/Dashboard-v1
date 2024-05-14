import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import { mockDataAllBots } from "../../data/mockData";
import Header from "../../components/Header";

const WhatsAppBots = () => {
  const theme = useTheme();
  const colors = tokens;

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
      cellClassName: "phone-column--cell",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
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
    bot.platforms.includes("WhatsApp")
  );

  return (
    <Box margin="20px" width="50%">
      <Header title="WhatsApp Bots" subtitle="Managing WhatsApp Bots" />
      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .phone-column--cell": {
            color: colors.greenAccent,
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#28231d",
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#0c0908",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: "#28231d",
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent} !important`,
          },
        }}
      >
        <DataGrid rows={filteredData} columns={columns} />
      </Box>
    </Box>
  );
};

export default WhatsAppBots;
