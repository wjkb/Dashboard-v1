import React, { useEffect, useState } from "react";
import {
  Box,
  useTheme,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { getAllBots, updateBot, deleteBot } from "../../api";

const ManageBots = () => {
  const theme = useTheme();
  const colors = tokens;
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBot, setSelectedBot] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const botsData = await getAllBots();
        const transformedData = botsData.map((bot) => ({
          ...bot,
          Facebook: bot.platforms.some(
            (platform) => platform.platform === "Facebook"
          ),
          WhatsApp: bot.platforms.some(
            (platform) => platform.platform === "WhatsApp"
          ),
          Telegram: bot.platforms.some(
            (platform) => platform.platform === "Telegram"
          ),
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

  const handleEdit = async () => {
    try {
      await updateBot(selectedBot.id, selectedBot);
      setBots(
        bots.map((bot) => (bot.id === selectedBot.id ? selectedBot : bot))
      );
      setEditDialogOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setSelectedBot({ ...selectedBot, [e.target.name]: e.target.value });
  };

  const handleEditClick = (bot) => {
    setSelectedBot(bot);
    setEditDialogOpen(true);
  };

  const handleDelete = async (botId) => {
    try {
      await deleteBot(botId);
      setBots(bots.filter((bot) => bot.id !== botId));
    } catch (err) {
      setError(err.message);
    }
  };

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
      flex: 0.5,
      renderCell: (params) => renderPlatformIcon(params.row.Facebook),
    },
    {
      field: "WhatsApp",
      headerName: "WhatsApp",
      flex: 0.5,
      renderCell: (params) => renderPlatformIcon(params.row.WhatsApp),
    },
    {
      field: "Telegram",
      headerName: "Telegram",
      flex: 0.5,
      renderCell: (params) => renderPlatformIcon(params.row.Telegram),
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
            onClick={() => handleDelete(params.row.id)}
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
        <DataGrid rows={bots} columns={columns} />
      </Box>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Bot</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Phone Number"
            type="text"
            fullWidth
            name="phone"
            value={selectedBot?.phone || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            name="name"
            value={selectedBot?.name || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            name="email"
            value={selectedBot?.email || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Persona"
            type="text"
            fullWidth
            name="persona"
            value={selectedBot?.persona || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Model"
            type="text"
            fullWidth
            name="model"
            value={selectedBot?.model || ""}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageBots;
