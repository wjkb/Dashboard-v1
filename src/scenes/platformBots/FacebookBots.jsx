import { Box, useTheme, Button } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import { mockDataAllBots } from "../../data/mockData";
import Header from "../../components/Header";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { useNavigate, Outlet } from "react-router-dom";

const FacebookBots = () => {
  const theme = useTheme();
  const colors = tokens;
  const navigate = useNavigate();

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
      headerName: "Conversations",
      flex: 2,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<QuestionAnswerIcon />}
            style={{ width: "100px", marginRight: "10px" }}
            onClick={() => navigate(`/platforms/facebook/${params.row.id}`)}
          >
            View
          </Button>
        </Box>
      ),
    },
  ];

  const filteredData = mockDataAllBots.filter((bot) =>
    bot.platforms.includes("Facebook")
  );

  return (
    <Box display="flex">
      <Box margin="20px" width="40%">
        <Header title="Facebook Bots" subtitle="Managing Facebook Bots" />
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
      <Box flex={1} height="100%">
        <Outlet />
      </Box>
    </Box>
  );
};

export default FacebookBots;
