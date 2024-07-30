import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

/**
 * Renders a confirmation dialog for submitting form details.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Determines whether the dialog is open.
 * @param {Function} props.onClose - Callback function to close the dialog.
 * @param {Function} props.onConfirm - Callback function to confirm submission.
 * @param {Object} props.values - Form values to display in the dialog.
 * @param {string} props.values.phoneNumber - Phone number input value.
 * @param {string} props.values.name - Name input value.
 * @param {string} props.values.email - Email input value.
 * @param {string} props.values.persona - Persona input value.
 * @param {string} props.values.model - Model input value.
 * @param {Array<string>} props.values.platforms - Selected platforms input value.
 * @returns {JSX.Element} - AddConfirmationDialog component.
 */
const AddConfirmationDialog = ({ open, onClose, onConfirm, values }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Submission</DialogTitle>
      <DialogContent>
        Are you sure you want to submit the form with the following details?
        <br />
        Phone Number: {values.phoneNumber}
        <br />
        Name: {values.name}
        <br />
        Email: {values.email}
        <br />
        Persona: {values.persona}
        <br />
        Model: {values.model}
        <br />
        Platforms: {values.platforms.join(", ")}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="secondary" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddConfirmationDialog;
