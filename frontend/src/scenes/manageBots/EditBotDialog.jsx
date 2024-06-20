import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  MenuItem,
  ListItemText,
  Box,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";

const phoneRegExp = /^(6|8|9)\d{7}$/;

const platformNames = ["Facebook", "WhatsApp", "Telegram"];

const botSchema = yup.object().shape({
  phone: yup
    .string()
    .required("required")
    .matches(phoneRegExp, "Invalid phone number"),
  name: yup.string().required("required"),
  email: yup.string().email("Invalid email"),
  persona: yup.string().required("required"),
  model: yup.string().required("required"),
  platforms: yup.array().min(1, "required"),
});

/**
 * Dialog component for editing a bot.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {Function} props.onClose - Function to call when closing the dialog.
 * @param {Object} props.bot - The bot to edit.
 * @param {Function} props.onSave - Function to call when saving the edited bot.
 * @returns {JSX.Element} The EditBotDialog component.
 */
const EditBotDialog = ({ open, onClose, bot, onSave }) => {
  const initialValues = {
    phone: bot ? bot.phone : "",
    name: bot ? bot.name : "",
    email: bot ? bot.email : "",
    persona: bot ? bot.persona : "",
    model: bot ? bot.model : "",
    platforms: bot ? bot.platforms : [],
  };

  /**
   * Handles saving the edited bot data.
   *
   * @param {Object} values - The values from the form.
   */
  const handleSave = async (values) => {
    onSave(values);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Bot</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={botSchema}
          onSubmit={handleSave}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                margin="dense"
                name="phone"
                label="Phone Number"
                type="text"
                fullWidth
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone && !!errors.phone}
                helperText={touched.phone && errors.phone}
              />
              <TextField
                margin="dense"
                name="name"
                label="Name"
                type="text"
                fullWidth
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
              />
              <TextField
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />
              <TextField
                margin="dense"
                name="persona"
                label="Persona"
                type="text"
                fullWidth
                value={values.persona}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.persona && !!errors.persona}
                helperText={touched.persona && errors.persona}
              />
              <TextField
                margin="dense"
                name="model"
                label="Model"
                type="text"
                fullWidth
                value={values.model}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.model && !!errors.model}
                helperText={touched.model && errors.model}
              />
              <TextField
                select
                fullWidth
                variant="filled"
                label="Platform(s)"
                id="platforms"
                name="platforms"
                value={values.platforms}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.platforms && !!errors.platforms}
                helperText={touched.platforms && errors.platforms}
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) => selected.join(", "),
                }}
                margin="normal"
              >
                {platformNames.map((platform) => (
                  <MenuItem key={platform} value={platform}>
                    <Checkbox checked={values.platforms.includes(platform)} />
                    <ListItemText primary={platform} />
                  </MenuItem>
                ))}
              </TextField>
              <DialogActions>
                <Button onClick={onClose} color="primary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Save
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default EditBotDialog;
