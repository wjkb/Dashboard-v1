import React, { useEffect, useState } from "react";
import { Tooltip, Box, useTheme, Button, Collapse } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { useNavigate, Outlet } from "react-router-dom";
import { getPlatformBots } from "../../api";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import PlatformBotConversations from "../conversations/PlatformBotConversations";

/**
 * Component to manage and display Platform bots.
 *
 * @returns {JSX.Element} The PlatformBots component.
 */
const PlatformBots = ({ platform }) => {
  const theme = useTheme();
  const colors = tokens;
  const navigate = useNavigate();
  const [bots, setBots] = useState([]);
  const [hideMainTable, setHideMainTable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleMainTableVisibility = () => {
    setHideMainTable((prev) => !prev);
  };

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const botsData = await getPlatformBots(platform);
        console.log("Bots data:", botsData);
        // const activeBotsData = botsData.filter((bot) => bot.active);
        // const deactivatedBotsData = botsData.filter((bot) => !bot.active);
        setBots(botsData);
        // setActiveBots(activeBotsData);
        // setDeactivatedBots(deactivatedBotsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBots();
  }, [platform]);

  const columns = [
    {
      field: "active",
      headerName: "Status",
      flex: 0.5,
      renderCell: (params) => {
        const isActive = params.value;
        const color = isActive ? "green" : "red";
        const statusText = isActive ? "Activated" : "Deactivated";

        return (
          <Tooltip title={statusText} arrow>
            <FiberManualRecordIcon style={{ color, marginTop: "15px" }} />
          </Tooltip>
        );
      },
    },
    {
      field: "id",
      headerName: "ID/Phone Number",
      flex: 1,
      cellClassName: "phone-column--cell",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "persona",
      headerName: "Persona",
      flex: 1,
    },

    {
      field: "conversations",
      headerName: "Conversations",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<QuestionAnswerIcon />}
            style={{ width: "100px", marginRight: "10px" }}
            onClick={() =>
              navigate(`/platforms/${platform.toLowerCase()}/${params.row.id}`)
            }
          >
            View
          </Button>
        </Box>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ height: "90vh", margin: "20px" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          <Button
            onClick={toggleMainTableVisibility}
            style={{
              display: "flex",
              fontSize: "0.8rem", // Equivalent to h1 size
              backgroundColor: "#808080", // Grey background
              color: "#ffffff", // White font color
              borderRadius: "8px", // Slightly rounded edges
              padding: "5px 10px", // Larger padding for a big button
              // marginBottom: "10px"
            }}
          >
            {hideMainTable ?  `Show ${platform} bots`: `Hide ${platform} bots`}
          </Button>
          {!hideMainTable && 
          <Box
            height={"50vh"}
            marginTop={"10px"}
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
            <DataGrid
              rows={bots}
              columns={columns}
              sortModel={[
                {
                  field: "active",
                  sort: "desc", // 'desc' sorts true first, 'asc' sorts false first
                },
              ]}
            />
          </Box>}
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default PlatformBots;
