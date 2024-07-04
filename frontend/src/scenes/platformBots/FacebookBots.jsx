import React, { useEffect, useState } from "react";
import { Box, useTheme, Button } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { useNavigate, Outlet } from "react-router-dom";
import { getPlatformBots } from "../../api";

/**
 * Component to manage and display Facebook bots.
 *
 * @returns {JSX.Element} The FacebookBots component.
 */
const FacebookBots = () => {
  const theme = useTheme();
  const colors = tokens;
  const navigate = useNavigate();
  const [bots, setBots] = useState([]);
  const [activeBots, setActiveBots] = useState([]);
  const [deactivatedBots, setDeactivatedBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const botsData = await getPlatformBots("facebook");
        console.log("Bots data:", botsData);
        const activeBotsData = botsData.filter((bot) => bot.active);
        const deactivatedBotsData = botsData.filter((bot) => !bot.active);
        setBots(botsData);
        setActiveBots(activeBotsData);
        setDeactivatedBots(deactivatedBotsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBots();
  }, []);

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
      field: "conversations",
      headerName: "Conversations",
      flex: 1,
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box display="flex">
      <Box margin="20px" width="40%">
        <Header title="Facebook Bots" subtitle="Active Facebook Bots" />
        <Box
          height={deactivatedBots.length > 0 ? "55vh" : "75vh"}
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
          <DataGrid rows={activeBots} columns={columns} />
        </Box>
        {deactivatedBots.length > 0 && (
          <>
            <Header title="" subtitle="Deactivated Facebook Bots" />
            <Box
              height="20vh"
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
              <DataGrid rows={deactivatedBots} columns={columns} />
            </Box>
          </>
        )}
      </Box>
      <Box flex={1} height="100%">
        <Outlet />
      </Box>
    </Box>
  );
};

export default FacebookBots;
