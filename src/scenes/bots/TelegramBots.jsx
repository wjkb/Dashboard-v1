import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import { mockDataAllBots } from "../../data/mockData";
import Header from "../../components/Header";

const TelegramBots = () => {
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
    bot.platforms.includes("Telegram")
  );

  return (
    <Box margin="20px" width="50%">
      <Header title="Telegram Bots" subtitle="Managing Telegram Bots" />
      <Box height="75vh">
        <DataGrid rows={filteredData} columns={columns} />
      </Box>
    </Box>
  );
};

export default TelegramBots;
