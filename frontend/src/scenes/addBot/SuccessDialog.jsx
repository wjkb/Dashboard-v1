import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

/**
 * Renders a dialog component indicating successful creation of a bot.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Determines whether the dialog is open.
 * @param {Function} props.onClose - Callback function to close the dialog.
 * @returns {JSX.Element} - SuccessDialog component.
 */
const SuccessDialog = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Success</DialogTitle>
      <DialogContent>The bot has been successfully created!</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessDialog;
