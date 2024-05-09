import {
  Box,
  Button,
  TextField,
  InputLabel,
  ListItemText,
  FormHelperText,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const initialValues = {
  phoneNumber: "",
  name: "",
  email: "",
  persona: "",
  model: "",
  platforms: [],
};

const phoneRegExp = /^(6|8|9)\d{7}$/;

const platformNames = ["Facebook", "Whatsapp", "Telegram"];

const botScheme = yup.object().shape({
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(phoneRegExp, "Invalid phone number"),
  name: yup.string().required("required"),
  email: yup.string().email("Invalid email"),
  persona: yup.string().required("required"),
  model: yup.string().required("required"),
  platforms: yup.array().min(1, "required"),
});

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    console.log(values);
  };

  return (
    <Box m="20px">
      <Header title="Add New Bot" subtitle="" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={botScheme}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {/* Phone Number field*/}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Phone Number"
                placeholder="e.g. 91234567"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phoneNumber}
                name="phoneNumber"
                error={!!touched.phoneNumber && !!errors.phoneNumber}
                helperText={touched.phoneNumber && errors.phoneNumber}
                sx={{ gridColumn: "span 4" }}
              />
              {/* Name field*/}
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
              {/* Email field*/}
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
              {/* Persona field*/}
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
              {/* Model field*/}
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

              {/* Platform field*/}
              <TextField
                select
                fullWidth
                variant="filled"
                label="Platforms"
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
              <Button type="submit" color="secondary" variant="contained">
                Create New Bot
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Form;
