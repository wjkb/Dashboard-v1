import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, bot }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Bot</DialogTitle>
      <DialogContent>
        Are you sure you want to delete the bot with the following details?:
        <br />
        Phone Number: {bot.phone}
        <br />
        Name: {bot.name}
        <br />
        Email: {bot.email}
        <br />
        Persona: {bot.persona}
        <br />
        Model: {bot.model}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
