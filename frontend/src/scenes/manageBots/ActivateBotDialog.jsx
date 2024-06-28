import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

/**
 * Dialog component for confirming the activation of a bot.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {Function} props.onClose - Function to call when closing the dialog.
 * @param {Function} props.onConfirm - Function to call when confirming the activation.
 * @param {Object} props.bot - The bot to activate.
 * @returns {JSX.Element} The ActivateBotDialog component.
 */
const ActivateBotDialog = ({ bot, open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Activate Bot</DialogTitle>
      <DialogContent>
        Are you sure you want to activate the bot with the following details?:
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
          Activate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActivateBotDialog;
