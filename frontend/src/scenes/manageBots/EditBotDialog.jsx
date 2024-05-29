import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

const EditBotDialog = ({ open, onClose, bot, onSave }) => {
  const [formData, setFormData] = useState({
    phone: "",
    name: "",
    email: "",
    persona: "",
    model: "",
    Facebook: false,
    WhatsApp: false,
    Telegram: false,
  });

  useEffect(() => {
    if (bot) {
      setFormData({
        phone: bot.phone,
        name: bot.name,
        email: bot.email,
        persona: bot.persona,
        model: bot.model,
        Facebook: bot.platforms.some(
          (platform) => platform.platform === "Facebook"
        ),
        WhatsApp: bot.platforms.some(
          (platform) => platform.platform === "WhatsApp"
        ),
        Telegram: bot.platforms.some(
          (platform) => platform.platform === "Telegram"
        ),
      });
    }
  }, [bot]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    const platforms = [];
    if (formData.Facebook) platforms.push("Facebook");
    if (formData.WhatsApp) platforms.push("WhatsApp");
    if (formData.Telegram) platforms.push("Telegram");

    onSave({
      ...formData,
      platforms,
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Bot</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="phone"
          label="Phone Number"
          type="text"
          fullWidth
          value={formData.phone}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="name"
          label="Name"
          type="text"
          fullWidth
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="email"
          label="Email"
          type="email"
          fullWidth
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="persona"
          label="Persona"
          type="text"
          fullWidth
          value={formData.persona}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="model"
          label="Model"
          type="text"
          fullWidth
          value={formData.model}
          onChange={handleChange}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.Facebook}
              onChange={handleChange}
              name="Facebook"
            />
          }
          label="Facebook"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.WhatsApp}
              onChange={handleChange}
              name="WhatsApp"
            />
          }
          label="WhatsApp"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.Telegram}
              onChange={handleChange}
              name="Telegram"
            />
          }
          label="Telegram"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBotDialog;
