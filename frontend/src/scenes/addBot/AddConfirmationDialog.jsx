import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

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
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="secondary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddConfirmationDialog;
