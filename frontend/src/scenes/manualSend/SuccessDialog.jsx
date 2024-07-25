import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

/**
 * Renders a dialog component indicating successful proactive send of a bot.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Determines whether the dialog is open.
 * @param {Function} props.onClose - Callback function to close the dialog.
 * @param {Object} props.formValues - Form values to display in the dialog.
 * @returns {JSX.Element} - SuccessDialog component.
 */
const SuccessDialog = ({ open, onClose, formValues }) => {
  const scammerIds = formValues.scammerIds.split(",");

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Success</DialogTitle>
      <DialogContent>
        <p>
          The following Scammer ID(s) will be added once the bot has engaged
          with the scammer!
        </p>
        <p>Scammer ID(s):</p>
        {scammerIds.map((scammerId, index) => (
          <div key={index}>{scammerId}</div>
        ))}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessDialog;
