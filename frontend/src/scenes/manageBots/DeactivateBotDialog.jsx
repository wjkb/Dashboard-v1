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
 * @returns {JSX.Element} The DeactivateBotDialog component.
 */
const DeactivateBotDialog = ({ bot, open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Deactivate Bot</DialogTitle>
      <DialogContent>
        Are you sure you want to deactivate the bot with the following details?:
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
        <Button onClick={onConfirm} color="warning">
          Deactivate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeactivateBotDialog;
