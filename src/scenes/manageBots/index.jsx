import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import { mockDataAllBots } from "../../data/mockData";
import Header from "../../components/Header";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const transformedData = mockDataAllBots.map((bot) => ({
  ...bot,
  Facebook: bot.platforms.includes("Facebook"),
  WhatsApp: bot.platforms.includes("WhatsApp"),
  Telegram: bot.platforms.includes("Telegram"),
}));

const ManageBots = () => {
  const theme = useTheme();
  const colors = tokens;

  const renderPlatformIcon = (value) => {
    return value ? (
      <CheckIcon style={{ color: "green" }} />
    ) : (
      <CloseIcon style={{ color: "red" }} />
    );
  };

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
    {
      field: "Facebook",
      headerName: "Facebook",
      flex: 1,
      renderCell: (params) => renderPlatformIcon(params.row.Facebook),
    },
    {
      field: "WhatsApp",
      headerName: "WhatsApp",
      flex: 1,
      renderCell: (params) => renderPlatformIcon(params.row.WhatsApp),
    },
    {
      field: "Telegram",
      headerName: "Telegram",
      flex: 1,
      renderCell: (params) => renderPlatformIcon(params.row.Telegram),
    },
  ];

  return (
    <Box margin="20px" width="80%">
      <Header title="All Bots" subtitle="Managing All Bots" />
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
        <DataGrid rows={transformedData} columns={columns} />
      </Box>
    </Box>
  );
};

export default ManageBots;
