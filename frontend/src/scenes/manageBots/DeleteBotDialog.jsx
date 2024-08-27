import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

/**
 * Dialog component for confirming the deletion of a bot.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {Function} props.onClose - Function to call when closing the dialog.
 * @param {Function} props.onConfirm - Function to call when confirming the deletion.
 * @param {Object} props.bot - The bot to delete.
 * @returns {JSX.Element} The DeleteBotDialog component.
 */
const DeleteBotDialog = ({ bot, open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Bot</DialogTitle>
      <DialogContent>
        Are you sure you want to delete the bot with the following details?:
        <br />
        ID: {bot.id}
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
        <Button onClick={onClose}sx={{ color: 'white', backgroundColor: '#9c27b0', '&:hover': { backgroundColor: '#ab47bc' } }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} sx={{ color: 'white', backgroundColor: '#9c27b0', '&:hover': { backgroundColor: '#ab47bc' } }}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteBotDialog;
