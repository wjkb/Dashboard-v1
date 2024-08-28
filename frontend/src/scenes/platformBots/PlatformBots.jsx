import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Tooltip,
  Box,
  useTheme,
  Button,
  Collapse,
} from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { useNavigate, Outlet } from "react-router-dom";
import { getPlatformBots } from "../../api";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { toggleBotPauseSelectively } from "../../api";

/**
 * Component to manage and display Platform bots.
 *
 * @returns {JSX.Element} The PlatformBots component.
 */
const PlatformBots = ({ platform }) => {
  const colors = tokens;
  const navigate = useNavigate();
  const [bots, setBots] = useState([]);
  const [hideMainTable, setHideMainTable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openPauseDialog, setOpenPauseDialog] = useState(false);
  const [openResumeDialog, setOpenResumeDialog] = useState(false);
  const [currentBotId, setCurrentBotId] = useState(null);

  const toggleMainTableVisibility = () => {
    setHideMainTable((prev) => !prev);
  };

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const botsData = await getPlatformBots(platform);
        // console.log("Bots data:", botsData);

        setBots(botsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBots();
  }, [platform]);

  // Define dialog content for pausing
  const PauseDialog = ({ open, onClose, onConfirm }) => (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontSize: "h3.fontSize" }}>Pause Bot</DialogTitle>
      <DialogContent>
        <Typography>Pausing bot. Will not reply to messages.</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: "white",
            backgroundColor: "#9c27b0",
            "&:hover": { backgroundColor: "#ab47bc" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          sx={{
            color: "white",
            backgroundColor: "#9c27b0",
            "&:hover": { backgroundColor: "#ab47bc" },
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Define dialog content for resuming
  const ResumeDialog = ({ open, onClose, onConfirm }) => (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontSize: "h3.fontSize" }}>Resume Bot</DialogTitle>
      <DialogContent>
        <Typography>
          Resuming bot. Conversations that were previously paused and
          conversations with pending incoming messages will be paused.
        </Typography>

        <Typography>
          Manually unpause the conversation to generate a response.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: "white",
            backgroundColor: "#9c27b0",
            "&:hover": { backgroundColor: "#ab47bc" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          sx={{
            color: "white",
            backgroundColor: "#9c27b0",
            "&:hover": { backgroundColor: "#ab47bc" },
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Pausing/Unpausing

  const togglePause = async (botId) => {
    try {
      await toggleBotPauseSelectively(botId);

      const updatedBots = bots.map((bot) =>
        bot.id === botId ? { ...bot, pause: !bot.pause } : bot
      );
      // console.log(updatedBots);
      setBots(updatedBots);
    } catch (error) {
      console.error("Failed to toggle pause state:", error);
      setError("Failed to update bot state. Please try again.");
    }
  };

  // Handle open dialog
  const handleOpenPauseDialog = (id) => {
    setCurrentBotId(id);
    setOpenPauseDialog(true);
  };

  const handleClosePauseDialog = () => {
    setOpenPauseDialog(false);
  };

  const handlePauseConfirm = () => {
    // Call your pause function here with currentBotId
    togglePause(currentBotId);
    handleClosePauseDialog();
  };

  const handleOpenResumeDialog = (id) => {
    setCurrentBotId(id);
    setOpenResumeDialog(true);
  };

  const handleCloseResumeDialog = () => {
    setOpenResumeDialog(false);
    setCurrentBotId(null);
  };

  const handleResumeConfirm = () => {
    // Call your resume function here with currentBotId
    togglePause(currentBotId);
    handleCloseResumeDialog();
  };

  const columns = [
    {
      field: "active",
      headerName: "Status",
      flex: 0.5,
      renderCell: (params) => {
        const isActive = params.value;
        const color = isActive ? "green" : "red";
        const statusText = isActive ? "Activated" : "Deactivated";

        return (
          <Tooltip title={statusText} arrow>
            <FiberManualRecordIcon style={{ color, marginTop: "15px" }} />
          </Tooltip>
        );
      },
    },
    {
      field: "id",
      headerName: "ID/Phone Number",
      flex: 1,
      cellClassName: "phone-column--cell",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "persona",
      headerName: "Persona",
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
            onClick={() =>
              navigate(`/platforms/${platform.toLowerCase()}/${params.row.id}`)
            }
          >
            View
          </Button>
        </Box>
      ),
    },
    {
      field: "pause",
      headerName: "Pause/Resume Bot",
      flex: 1,
      renderCell: (params) => {
        const isPaused = params.row.pause; // Adjust based on your bot state
        return (
          <Box>
            {isPaused ? (
              <Tooltip title="Resume Bot" arrow>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => handleOpenResumeDialog(params.row.id)}
                  sx={{
                    width: "50%",
                    margin: "10px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    padding: "5px", // Adjust padding to fit text
                    display: "flex",
                    justifyContent: "center", // Center text
                    alignItems: "center", // Center text
                  }}
                >
                  Resume Bot
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="Pause Bot" arrow>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<PauseIcon />}
                  onClick={() => handleOpenPauseDialog(params.row.id)}
                  sx={{
                    width: "50%",
                    margin: "10px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    padding: "5px", // Adjust padding to fit text
                    display: "flex",
                    justifyContent: "center", // Center text
                    alignItems: "center", // Center text
                  }}
                >
                  Pause Bot
                </Button>
              </Tooltip>
            )}
          </Box>
        );
      },
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ height: "90vh", margin: "20px" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          <Button
            onClick={toggleMainTableVisibility}
            style={{
              display: "flex",
              width: "100%",
              fontSize: "0.8rem", // Equivalent to h1 size
              backgroundColor: "#808080", // Grey background
              color: "#ffffff", // White font color
              borderRadius: "8px", // Slightly rounded edges
              padding: "5px 10px", // Larger padding for a big button
              border: "3px solid #ffffff", // Thick white border
              // marginBottom: "10px"
            }}
          >
            {hideMainTable ? `Show ${platform} bots` : `Hide ${platform} bots`}
          </Button>
          {!hideMainTable && (
            <Box
              height={"50vh"}
              marginTop={"10px"}
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
              <DataGrid
                rows={bots}
                columns={columns}
                sortModel={[
                  {
                    field: "active",
                    sort: "desc", // 'desc' sorts true first, 'asc' sorts false first
                  },
                ]}
              />
            </Box>
          )}
        </div>
        {/* Pause Dialog */}
        <PauseDialog
          open={openPauseDialog}
          onClose={handleClosePauseDialog}
          onConfirm={handlePauseConfirm}
        />

        {/* Resume Dialog */}
        <ResumeDialog
          open={openResumeDialog}
          onClose={handleCloseResumeDialog}
          onConfirm={handleResumeConfirm}
        />
        <Outlet />
      </div>
    </div>
  );
};

export default PlatformBots;
