import React, { useEffect, useState } from "react";
import { Box, useTheme, Button } from "@mui/material";
import { tokens } from "../../../theme";
import { DataGrid } from "@mui/x-data-grid";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { getBotConversations } from "../../../api";
import Header from "../../../components/Header";

const TelegramBotConversations = () => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens;
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const convData = await getBotConversations("telegram", botId);
        setConversations(convData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [botId]);

  const columns = [
    {
      field: "user",
      headerName: "User",
      flex: 1,
      cellClassName: "userid-column--cell",
    },
    {
      field: "viewMessages",
      headerName: "View Messages",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            navigate(`/platforms/telegram/${botId}/${params.row.user}`)
          }
        >
          View
        </Button>
      ),
    },
  ];

  const rows = conversations.map((conv, index) => ({
    id: index + 1,
    user: conv.user,
  }));

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box display="flex">
      <Box margin="20px" width="30%">
        <Header
          title={`Conversations (ID: ${botId})`}
          subtitle="List of users this bot is talking to"
        />
        <Box
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .userid-column--cell": {
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
          <DataGrid rows={rows} columns={columns} />
        </Box>
      </Box>
      <Box flex={1} height="100%">
        <Outlet />
      </Box>
    </Box>
  );
};

export default TelegramBotConversations;
