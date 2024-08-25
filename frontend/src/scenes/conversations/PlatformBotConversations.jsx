import React, { useEffect, useState } from "react";
import { Box, useTheme, Button } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { getBotConversations, getAlertsSpecific } from "../../api";
import Header from "../../components/Header";
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import Tooltip from '@mui/material/Tooltip';

const PlatformBotConversations = ({ platform }) => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens;
  const [conversations, setConversations] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUnreadAlerts = async (platform, botId, scammerUniqueId) => {
    try {
      const alerts = await getAlertsSpecific(platform, botId, scammerUniqueId);
      return alerts.unread_count;
    } catch (err) {
      setError(err.message);
      return 0;
    }
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const convData = await getBotConversations(platform, botId);
        const rowsData = await Promise.all(
          convData.map(async (conv) => {
            const unreadCount = await fetchUnreadAlerts(platform, conv.bot_id, conv.scammer_unique_id);
            return {
              id: conv.scammer_id,
              scammerUniqueID: conv.scammer_unique_id,
              pause: conv.pause,
              alert: unreadCount,
            };
          })
        );
        setRows(rowsData);
        setConversations(convData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [botId, platform]);

  const columns = [
    {
      field: "alert",
      headerName: "Alerts",
      flex: 0.5,
      cellClassName: "useralert-column--cell",
    }, 
    {
      field: "pause",
      headerName: "Paused",
      flex: 0.5,
      cellClassName: "userpause-column--cell",
      renderCell: (params) => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          {params.value ? (
            <Tooltip title="Conversation is paused">
              <PauseCircleIcon />
            </Tooltip>
          ) : null}
        </Box>
      ),
    },
    {
      field: "scammerUniqueID",
      headerName: "Scammer Unique ID",
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
            navigate(`/platforms/${platform.toLowerCase()}/${botId}/${params.row.scammerUniqueID}`)
          }
        >
          View
        </Button>
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

export default PlatformBotConversations;
