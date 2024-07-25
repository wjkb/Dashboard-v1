import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

/**
 * Renders a dialog component indicating successful proactive send of a bot.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Determines whether the dialog is open.
 * @param {Function} props.onClose - Callback function to close the dialog.
 * @param {Object} props.formValues - Form values to display in the dialog.
 * @param {Object} props.sentBot - The bot object that was sent.
 * @returns {JSX.Element} - SuccessDialog component.
 */
const SuccessDialog = ({ open, onClose, formValues, sentBot }) => {
  const scammerIds = formValues.scammerIds.split(",");
  const navigate = useNavigate();

  const handleOkClick = () => {
    const lastScammerId = scammerIds[scammerIds.length - 1];
    navigate(
      `/platforms/${formValues.platform.toLowerCase()}/${
        sentBot.id
      }/${lastScammerId}`
    );
    onClose();
  };

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
        <p>Sent Bot ID: {sentBot?.id}</p> {/* Display the sent bot's id here */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOkClick} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessDialog;
