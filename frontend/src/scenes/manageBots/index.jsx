import React, { useEffect, useState } from "react";
import { Box, useTheme, Button, Typography } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import CloseIcon from "@mui/icons-material/Close";
import Circle from "@mui/icons-material/Circle";
import EditIcon from "@mui/icons-material/Edit";
import { getAllBots, editBot, deleteBot } from "../../api";
import EditBotDialog from "./EditBotDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

/**
 * Manages the display and operations for bots including editing and deleting.
 *
 * @returns {JSX.Element} The ManageBots component.
 */
const ManageBots = () => {
  const theme = useTheme();
  const colors = tokens;
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBot, setSelectedBot] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    /**
     * Fetches all bots from the API and sets the state.
     */
    const fetchBots = async () => {
      try {
        const botsData = await getAllBots();
        const transformedData = botsData.map((bot) => ({
          ...bot,
          Facebook: bot.platforms.includes("Facebook"),
          WhatsApp: bot.platforms.includes("WhatsApp"),
          Telegram: bot.platforms.includes("Telegram"),
        }));
        setBots(transformedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBots();
  }, []);

  /**
   * Handles the click event for editing a bot.
   *
   * @param {Object} bot - The bot to be edited.
   */
  const handleEditClick = (bot) => {
    setSelectedBot(bot);
    setEditDialogOpen(true);
  };

  /**
   * Closes the edit dialog.
   */
  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedBot(null);
  };

  /**
   * Handles saving the updated bot data.
   *
   * @param {Object} updatedData - The updated bot data.
   */
  const handleSave = async (updatedData) => {
    try {
      await editBot(selectedBot.id, updatedData);
      const updatedBots = bots.map((bot) =>
        bot.id === selectedBot.id
          ? {
              ...bot,
              ...updatedData,
              platforms: updatedData.platforms.map((platform) => ({
                platform,
              })),
              Facebook: updatedData.platforms.includes("Facebook"),
              WhatsApp: updatedData.platforms.includes("WhatsApp"),
              Telegram: updatedData.platforms.includes("Telegram"),
            }
          : bot
      );
      setBots(updatedBots);
      handleDialogClose();
    } catch (error) {
      setError(error.message);
    }
  };

  /**
   * Handles the click event for deleting a bot.
   *
   * @param {Object} bot - The bot to be deleted.
   */
  const handleDeleteClick = (bot) => {
    setSelectedBot(bot);
    setDeleteDialogOpen(true);
  };

  /**
   * Closes the delete confirmation dialog.
   */
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedBot(null);
  };

  /**
   * Confirms the deletion of a bot.
   */
  const handleDeleteConfirm = async () => {
    try {
      await deleteBot(selectedBot.id);
      setBots(bots.filter((bot) => bot.id !== selectedBot.id));
      handleDeleteDialogClose();
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Renders platform icon based on the presence of the platform.
   *
   * @param {string} platform - The platform to be checked.
   * @param {boolean} isRegisteredOnPlatform - The presence of the platform.
   * @param {Object} health - The health status of the bot.
   * @returns {JSX.Element} Green check icon if present, red close icon if not.
   */
  const renderHealthIcon = (platform, isRegisteredOnPlatform, health) => {
    if (!isRegisteredOnPlatform) {
      return <CloseIcon style={{ color: "grey" }} />;
    }

    const status = health[platform];
    let color;
    switch (status) {
      case "running":
        color = "green";
        break;
      case "idle":
        color = "orange";
        break;
      case "not_running":
      default:
        color = "red";
        break;
    }

    return <Circle style={{ color }} fontSize="small" />;
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
      flex: 0.5,
      renderCell: (params) =>
        renderHealthIcon(
          "Facebook",
          params.row.Facebook,
          params.row.health_status
        ),
    },
    {
      field: "WhatsApp",
      headerName: "WhatsApp",
      flex: 0.5,
      renderCell: (params) =>
        renderHealthIcon(
          "WhatsApp",
          params.row.WhatsApp,
          params.row.health_status
        ),
    },
    {
      field: "Telegram",
      headerName: "Telegram",
      flex: 0.5,
      renderCell: (params) =>
        renderHealthIcon(
          "Telegram",
          params.row.Telegram,
          params.row.health_status
        ),
    },
    {
      headerName: "Actions",
      flex: 2,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            style={{ width: "100px", marginRight: "10px" }}
            onClick={() => handleEditClick(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<CloseIcon />}
            style={{ width: "100px" }}
            onClick={() => handleDeleteClick(params.row)}
          >
            Delete
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
    <Box margin="20px" width="auto">
      <Header title="All Bots" subtitle="Managing All Bots" />

      {/* DataGrid for displaying all bots */}
      <Box
        height="60vh"
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
        <DataGrid rows={bots} columns={columns} />
      </Box>

      {/* Legend for Status Icons */}
      <Box mt={2}>
        <Typography variant="h6" gutterBottom>
          Legend for Status Icons:
        </Typography>
        <Box display="flex" alignItems="center" mb={1}>
          <span className="closeicon grey" style={{ marginRight: 8 }}></span>
          <CloseIcon style={{ color: "grey" }} fontSize="small" />
          <Typography variant="body1">
            Not Registered: Bot is not registered on this platform
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <span className="circle green" style={{ marginRight: 8 }}></span>
          <Circle style={{ color: "green" }} fontSize="small" />
          <Typography variant="body1">
            Running: Bot is currently active and running
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <span className="circle orange" style={{ marginRight: 8 }}></span>
          <Circle style={{ color: "orange" }} fontSize="small" />
          <Typography variant="body1">
            Idle: Bot is currently active but idle (no recent messages
            exchanged)
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <span className="circle red" style={{ marginRight: 8 }}></span>
          <Circle style={{ color: "red" }} fontSize="small" />
          <Typography variant="body1">
            Not Running: Bot is currently not running.
          </Typography>
        </Box>
      </Box>

      {/* Conditional rendering of EditBotDialog */}
      {selectedBot && (
        <EditBotDialog
          open={editDialogOpen}
          onClose={handleDialogClose}
          bot={selectedBot}
          onSave={handleSave}
        />
      )}

      {/* Conditional rendering of DeleteConfirmationDialog */}
      {selectedBot && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onClose={handleDeleteDialogClose}
          onConfirm={handleDeleteConfirm}
          bot={selectedBot}
        />
      )}
    </Box>
  );
};

export default ManageBots;
