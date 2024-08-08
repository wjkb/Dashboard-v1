import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  InputLabel,
  ListItemText,
  FormHelperText,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import AddConfirmationDialog from "./AddConfirmationDialog";
import SuccessDialog from "./SuccessDialog";
import { createBot } from "../../api";

const initialValues = {
  id: "",
  name: "",
  email: "",
  persona: "",
  model: "",
  platforms: [],
};

const platformNames = ["Facebook", "WhatsApp", "Telegram"];

const botScheme = yup.object().shape({
  id: yup.string().required("required"),
  name: yup.string().required("required"),
  email: yup.string().email("Invalid email"),
  persona: yup.string().required("required"),
  model: yup.string().required("required"),
  platforms: yup.array().min(1, "required"),
});

/**
 * Renders a form for adding a new bot, handling validation, submission,
 * and confirmation dialogs.
 *
 * @component
 * @returns {JSX.Element} - AddBotForm component.
 */
const AddBotForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false); // State for SuccessDialog
  const [formValues, setFormValues] = useState(initialValues);
  const [submitFormFn, setSubmitFormFn] = useState(() => () => {});

  /**
   * Handles form submission, validates the form, and triggers
   * the creation of a new bot.
   *
   * @param {Object} values - Form values.
   * @param {Function} resetForm - Formik resetForm function.
   */
  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const response = await createBot(values);
      console.log("Bot created successfully", response);
      resetForm();
      setIsDialogOpen(false);
      setIsSuccessDialogOpen(true); // Open SuccessDialog on successful submission
    } catch (error) {
      console.error("Error creating bot", error);
    }
  };

  /**
   * Opens the confirmation dialog if form validation passes,
   * otherwise shows validation errors.
   *
   * @param {Object} values - Form values.
   * @param {Function} submitForm - Formik submitForm function.
   * @param {Function} validateForm - Formik validateForm function.
   */
  const handleOpenDialog = async (values, submitForm, validateForm) => {
    const errors = await validateForm();
    if (Object.keys(errors).length === 0) {
      setFormValues(values);
      setSubmitFormFn(() => submitForm);
      setIsDialogOpen(true);
    } else {
      // Ensure that validation errors are shown if validation fails
      submitForm();
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmDialog = () => {
    submitFormFn();
  };

  const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
  };

  return (
    <Box m="20px">
      <Header title="Add New Bot" subtitle="" />

      <Formik
        initialValues={initialValues}
        validationSchema={botScheme}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          validateForm,
        }) => (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleOpenDialog(values, handleSubmit, validateForm);
              }}
            >
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                {/* ID field */}
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="ID"
                  placeholder="e.g. 91234567"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.id}
                  name="id"
                  error={!!touched.id && !!errors.id}
                  helperText={touched.id && errors.id}
                  sx={{ gridColumn: "span 4" }}
                />
                {/* Name field */}
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  sx={{ gridColumn: "span 4" }}
                />
                {/* Email field */}
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Email (optional)"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                {/* Persona field */}
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Persona"
                  placeholder="e.g. Old Lady"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.persona}
                  name="persona"
                  error={!!touched.persona && !!errors.persona}
                  helperText={touched.persona && errors.persona}
                  sx={{ gridColumn: "span 4" }}
                />
                {/* Model field */}
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Model Used to Train Bot"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.model}
                  name="model"
                  error={!!touched.model && !!errors.model}
                  helperText={touched.model && errors.model}
                  sx={{ gridColumn: "span 4" }}
                />

                {/* Platform field */}
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
                  error={!!touched.platforms && !!errors.platforms}
                  helperText={touched.platforms && errors.platforms}
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) => selected.join(", "),
                  }}
                  sx={{ gridColumn: "span 4" }}
                >
                  {platformNames.map((platform) => (
                    <MenuItem key={platform} value={platform}>
                      <Checkbox checked={values.platforms.includes(platform)} />
                      <ListItemText primary={platform} />
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  Create New Bot
                </Button>
              </Box>
            </form>
            <AddConfirmationDialog
              open={isDialogOpen}
              onClose={handleCloseDialog}
              onConfirm={handleConfirmDialog}
              values={formValues}
            />
            <SuccessDialog
              open={isSuccessDialogOpen}
              onClose={handleCloseSuccessDialog}
            />
          </>
        )}
      </Formik>
    </Box>
  );
};

export default AddBotForm;
