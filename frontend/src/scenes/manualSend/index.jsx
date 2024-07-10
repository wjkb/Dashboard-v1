import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, TextField, MenuItem, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { DataGrid } from "@mui/x-data-grid";
import { getAllBots, sendBot } from "../../api";
import Circle from "@mui/icons-material/Circle";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

const initialValues = {
  url: "",
  platform: "",
};

const URL_REGEX =
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
const platformNames = ["Facebook", "WhatsApp", "Telegram"];

const botScheme = yup.object().shape({
  url: yup.string().required("required").matches(URL_REGEX, "Invalid URL"),
  platform: yup.string().required("required"),
});

/**
 * Component for manually sending a bot to a given link.
 *
 * @component
 * @returns {JSX.Element} - ManualSendForm component.
 */
const ManualSendForm = () => {
  const colors = tokens;
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [formValues, setFormValues] = useState(initialValues);
  const [activeBots, setActiveBots] = useState([]);
  const [filteredBots, setFilteredBots] = useState([]);
  const [error, setError] = useState(null);

  const fetchBots = useCallback(async () => {
    try {
      const botsData = await getAllBots();
      const transformedData = botsData
        .filter((bot) => bot.active)
        .map((bot) => ({
          ...bot,
          Facebook: bot.platforms.includes("Facebook"),
          WhatsApp: bot.platforms.includes("WhatsApp"),
          Telegram: bot.platforms.includes("Telegram"),
        }));
      setActiveBots(transformedData);
      // Immediately filter the bots to update the DataGrid
      setFilteredBots(
        transformedData.filter((bot) =>
          bot.platforms.includes(formValues.platform)
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }, [formValues.platform]);

  useEffect(() => {
    fetchBots();
  }, [fetchBots]);

  const handleFormSubmit = (values, { setSubmitting }) => {
    setFormValues(values);
    setSubmitting(false);
  };

  const handleSendClick = async (bot) => {
    try {
      const { url: targetUrl, platform } = formValues;
      await sendBot(bot.phone, targetUrl, platform);
      // Fetch updated bot list after sending
      await fetchBots();
    } catch (error) {
      console.error("Error sending bot", error);
    }
  };

  /**
   * Renders platform icon based on the presence of the platform.
   *
   * @param {string} platform - The platform to be checked.
   * @param {boolean} isRegisteredOnPlatform - The presence of the platform.
   * @param {Object} health - The health status of the bot.
   * @returns {JSX.Element} Green check icon if present, red close icon if not.
   */
  const renderHealthIcon = (platform, isRegisteredOnPlatform, health) => {
    if (!isRegisteredOnPlatform) {
      return <CloseIcon style={{ color: "grey" }} />;
    }

    const status = health[platform];
    let color;
    switch (status) {
      case "running":
        color = "green";
        break;
      case "idle":
        color = "orange";
        break;
      case "not_running":
      default:
        color = "red";
        break;
    }

    return <Circle style={{ color }} fontSize="small" />;
  };

  /**
   * Columns configuration for the DataGrid displaying bot information.
   */
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
      cellClassName: "phone-column--cell",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "persona",
      headerName: "Persona",
      flex: 1,
    },
    {
      field: "model",
      headerName: "Model",
      flex: 1,
    },
    {
      field: "Facebook",
      headerName: "Facebook",
      flex: 0.5,
      renderCell: (params) =>
        renderHealthIcon(
          "Facebook",
          params.row.Facebook,
          params.row.health_status
        ),
    },
    {
      field: "WhatsApp",
      headerName: "WhatsApp",
      flex: 0.5,
      renderCell: (params) =>
        renderHealthIcon(
          "WhatsApp",
          params.row.WhatsApp,
          params.row.health_status
        ),
    },
    {
      field: "Telegram",
      headerName: "Telegram",
      flex: 0.5,
      renderCell: (params) =>
        renderHealthIcon(
          "Telegram",
          params.row.Telegram,
          params.row.health_status
        ),
    },
    {
      headerName: "Actions",
      flex: 2,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            style={{ width: "100px", marginRight: "10px" }}
            onClick={() => handleSendClick(params.row)}
          >
            Send
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Send A Bot To Given Link" subtitle="" />

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
          isSubmitting,
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
              {/* URL field */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="URL"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.url}
                name="url"
                error={!!touched.url && !!errors.url}
                helperText={touched.url && errors.url}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Platform field */}
              <TextField
                select
                fullWidth
                variant="filled"
                label="Platform"
                id="platform"
                name="platform"
                value={values.platform}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.platform && !!errors.platform}
                helperText={touched.platform && errors.platform}
                sx={{ gridColumn: "span 4" }}
              >
                {platformNames.map((platform) => (
                  <MenuItem key={platform} value={platform}>
                    {platform}
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
                Suggest Bots
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      {filteredBots.length > 0 && (
        <Box marginTop="20px" width="100%">
          <Header
            title="Filtered Bots"
            subtitle="Bots based on selected platform"
          />
          <Box
            height="55vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .phone-column--cell": {
                color: colors.greenAccent,
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#28231d",
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: "#0c0908",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: "#28231d",
              },
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent} !important`,
              },
            }}
          >
            <DataGrid rows={filteredBots} columns={columns} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ManualSendForm;
