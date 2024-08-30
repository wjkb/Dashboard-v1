import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  IconButton,
  TextField,
  useTheme,
  Switch,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  insertVictimProperty,
  deleteVictimProperty,
  getVictimDetails, // Import the new API function
  getAllBots,
  editBot,
  deactivateBot,
  activateBot,
  deleteBot,
} from "../../api";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import CloseIcon from "@mui/icons-material/Close";
import Circle from "@mui/icons-material/Circle";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import EditBotDialog from "./EditBotDialog";
import DeactivateBotDialog from "./DeactivateBotDialog";
import ActivateBotDialog from "./ActivateBotDialog";
import DeleteBotDialog from "./DeleteBotDialog";

const ManageBots = () => {
  const theme = useTheme();
  const colors = tokens;

  // All, active and deactive bots
  const [bots, setBots] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected bot to execute actions on
  const [selectedBot, setSelectedBot] = useState(null);

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [personaDialogOpen, setPersonaDialogOpen] = useState(false);

  // State for new property
  const [newProperty, setNewProperty] = useState({ key: "", value: "" });

  useEffect(() => {
    const fetchBots = async () => {
      try {
        // Fetch all bots
        const botsData = await getAllBots();
        const victimDetails = await getVictimDetails(); // Use the new API function
        const transformedData = botsData.map((bot) => {
          const victimKey = Object.keys(victimDetails).find(
            (key) => key === bot.id
            
          );
          const victim = victimKey ? victimDetails[victimKey] : null;
          // If bot.name or bot.email is null, replace with victim details
          return {
            ...bot,
            name: bot.name || victim?.name, // Use victim's name if bot's name is null
            email: bot.email || victim?.email, // Use victim's email if bot's email is null
            fullDetails: victim || {}, // Store all other victim details for view more
            Facebook: bot.platforms.includes("Facebook"),
            WhatsApp: bot.platforms.includes("WhatsApp"),
            Telegram: bot.platforms.includes("Telegram"),
          };
        });

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
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedBot(null);
  };

  /**
   * Handles saving the updated bot data.
   *
   * @param {Object} updatedData - The updated bot data.
   */
  const handleEditConfirm = async (updatedData) => {
    try {
      await editBot(selectedBot.id, updatedData);
      const updatedBots = bots.map((bot) =>
        bot.id === selectedBot.id
          ? {
              ...bot,
              ...updatedData,
              Facebook: updatedData.platforms.includes("Facebook"),
              WhatsApp: updatedData.platforms.includes("WhatsApp"),
              Telegram: updatedData.platforms.includes("Telegram"),
            }
          : bot
      );

      setBots(updatedBots);

      handleEditDialogClose();
    } catch (error) {
      setError(error.message);
    }
  };

  /**
   * Handles the click event for deactivating a bot.
   *
   * @param {Object} bot - The bot to be edited.
   */
  const handleDeactivateClick = (bot) => {
    setSelectedBot(bot);
    setDeactivateDialogOpen(true);
  };

  /**
   * Closes the deactivate confirmation dialog.
   */
  const handleDeactivateDialogClose = () => {
    setDeactivateDialogOpen(false);
    setSelectedBot(null);
  };

  /**
   * Confirms the deactivation of a bot.
   */
  const handleDeactivateConfirm = async () => {
    try {
      await deactivateBot(selectedBot.id);
      const updatedBots = bots.map((bot) =>
        bot.id === selectedBot.id ? { ...bot, active: false } : bot
      );
      setBots(updatedBots);
      handleDeactivateDialogClose();
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Handles the click event for activating a bot.
   *
   * @param {Object} bot - The bot to be edited.
   */
  const handleActivateClick = (bot) => {
    setSelectedBot(bot);
    setActivateDialogOpen(true);
  };

  /**
   * Closes the activate confirmation dialog.
   */
  const handleActivateDialogClose = () => {
    setActivateDialogOpen(false);
    setSelectedBot(null);
  };

  /**
   * Confirms the activation of a bot.
   */
  const handleActivateConfirm = async () => {
    try {
      await activateBot(selectedBot.id);
      const updatedBots = bots.map((bot) =>
        bot.id === selectedBot.id ? { ...bot, active: true } : bot
      );
      setBots(updatedBots);
      handleActivateDialogClose();
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Handles the click event for deleting a bot.
   *
   * @param {Object} bot - The bot to be deleted.
   */

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
   * Handles the click event for viewing more details about a bot.
   *
   * @param {Object} bot - The bot whose details are to be viewed.
   */
  const handleViewMoreClick = (bot) => {
    setSelectedBot(bot);
    setPersonaDialogOpen(true);
  };

  /**
   * Closes the persona dialog.
   */
  const handlePersonaDialogClose = () => {
    setPersonaDialogOpen(false);
    setSelectedBot(null);
  };

  /**
   * Handles the deletion of a property from the persona details.
   *
   * @param {string} keyToDelete - The key of the property to delete.
   */
// For inserting a new property
  const handleAddProperty = async () => {
    if (newProperty.key && newProperty.value) {
      try {
        await insertVictimProperty(selectedBot.id, newProperty.key, newProperty.value);
        const updatedDetails = {
          ...selectedBot.fullDetails,
          [newProperty.key]: newProperty.value,
        };
        const updatedBot = { ...selectedBot, fullDetails: updatedDetails };
        setSelectedBot(updatedBot);
        setBots(prevBots =>
          prevBots.map(bot => (bot.id === selectedBot.id ? updatedBot : bot))
        );
        setNewProperty({ key: "", value: "" });
      } catch (error) {
        console.error("Failed to add property:", error);
        setError("Failed to add property");
      }
    }
  };

  // For deleting a property
  const handleDeleteProperty = async (keyToDelete) => {
    try {
      await deleteVictimProperty(selectedBot.id, keyToDelete);
      const updatedDetails = { ...selectedBot.fullDetails };
      delete updatedDetails[keyToDelete];
      const updatedBot = { ...selectedBot, fullDetails: updatedDetails };
      setSelectedBot(updatedBot);
      setBots(prevBots =>
        prevBots.map(bot => (bot.id === selectedBot.id ? updatedBot : bot))
      );
    } catch (error) {
      console.error("Failed to delete property:", error);
      setError("Failed to delete property");
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

  const columnsActive = [
    {
      field: "active",
      headerName: "Status",
      flex: 0.3,
      renderCell: (params) => {
        const isActive = params.value;
        const color = isActive ? "green" : "red";
        return (
          <Tooltip title={isActive ? "Activated" : "Deactivated"} arrow>
            <FiberManualRecordIcon style={{ color }} />
          </Tooltip>
        );
      },
    },
    {
      field: "id",
      headerName: "ID",
      flex: 1,
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
      field: "viewMore",
      headerName: "Persona",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleViewMoreClick(params.row)}
        >
          View Persona
        </Button>
      ),
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
        <Box display="flex" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => handleEditClick(params.row)}
          >
            Edit
          </Button>
  
          <Switch
            checked={params.row.active}
            onChange={() =>
              params.row.active
                ? handleDeactivateClick(params.row)
                : handleActivateClick(params.row)
            }
            color="green"
            sx={{
              marginLeft: 2,
              "& .MuiSwitch-track": {
                backgroundColor: params.row.active ? "green" : "red",
              },
            }}
          />
          <Typography
            variant="body2"
            sx={{
              marginLeft: theme.spacing(1),
              color: params.row.active ? "green" : "red",
            }}
          >
            {params.row.active ? "Active" : "Inactive"}
          </Typography>
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
      <Box
        height={"65vh"}
        width={"100%"}
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
        <DataGrid rows={bots} columns={columnsActive} />
      </Box>

      {/* Status Icons Legend */}
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
            Idle: Bot is currently active but idle (no recent messages exchanged)
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

      {/* Dialogs for Edit, Deactivate, Activate, Delete */}
      {selectedBot && (
        <EditBotDialog
          bot={selectedBot}
          open={editDialogOpen}
          onClose={handleEditDialogClose}
          onSave={handleEditConfirm}
        />
      )}

      {selectedBot && (
        <DeactivateBotDialog
          bot={selectedBot}
          open={deactivateDialogOpen}
          onClose={handleDeactivateDialogClose}
          onConfirm={handleDeactivateConfirm}
        />
      )}

      {selectedBot && (
        <ActivateBotDialog
          bot={selectedBot}
          open={activateDialogOpen}
          onClose={handleActivateDialogClose}
          onConfirm={handleActivateConfirm}
        />
      )}

      {selectedBot && (
        <DeleteBotDialog
          bot={selectedBot}
          open={deleteDialogOpen}
          onClose={handleDeleteDialogClose}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* Persona Dialog */}
      {selectedBot && (
        <Dialog
          open={personaDialogOpen}
          onClose={handlePersonaDialogClose}
          maxWidth="md"
        >
          <DialogTitle>
            {selectedBot.name}'s Persona
            <IconButton
              aria-label="close"
              onClick={handlePersonaDialogClose}
              style={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  {Object.entries(selectedBot.fullDetails).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell component="th" scope="row">
                        {key}
                      </TableCell>
                      <TableCell>{value}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleDeleteProperty(key)}
                          color="secondary"
                          style={{ color: "red" }} // Make the trashcan icon red
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell>
                      <TextField
                        label="New Key"
                        value={newProperty.key}
                        onChange={(e) =>
                          setNewProperty({ ...newProperty, key: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        label="New Value"
                        value={newProperty.value}
                        onChange={(e) =>
                          setNewProperty({ ...newProperty, value: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={handleAddProperty}
                        color="primary"
                        style={{ color: "limegreen" }} // Make the + icon bright green
                      >
                        <AddIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default ManageBots;
