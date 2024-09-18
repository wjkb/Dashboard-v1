import React, { useState, useEffect } from "react";
import {
  Box,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
  ListItemIcon,
  Tooltip,
  Tabs,
  Tab,
} from "@mui/material";
import AlertOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import CircleIcon from "@mui/icons-material/FiberManualRecord";
import DeleteIcon from "@mui/icons-material/Delete";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import MailIcon from "@mui/icons-material/Mail";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  getAlerts,
  markAlertAsRead,
  markAllAlertsAsRead,
  markAlertAsUnread,
  deleteAlert,
  restoreAlert,
} from "../../api";
import "./AlertsMenu.css";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const AlertsMenu = () => {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [deletedAlerts, setDeletedAlerts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await getAlerts();
        if (data) {
          const { alerts = [] } = data;
          const activeAlerts = alerts.filter((alert) => alert.active);
          const inactiveAlerts = alerts.filter((alert) => !alert.active);

          setAlerts(activeAlerts);
          setDeletedAlerts(inactiveAlerts);
          setUnreadCount(
            activeAlerts.filter((alert) => !alert.read_status).length
          );
        }
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      }
    };

    fetchAlerts();
  }, []);

  const handleAlertClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAlertClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAlertItemClick = async (alert) => {
    try {
      await markAlertAsRead(alert.id);
      const updatedAlerts = alerts.map((a) =>
        a.id === alert.id ? { ...a, read_status: true } : a
      );
      setAlerts(updatedAlerts);
      setUnreadCount(updatedAlerts.filter((a) => !a.read_status).length);
    } catch (error) {
      console.error("Failed to mark alert as read:", error);
    }
  
    const { platform_type, bot_id, scammer_unique_id, message_id, direction } = alert;
  
    if (alert.link) {
      window.location.href = alert.link;
    } else if (platform_type && bot_id && scammer_unique_id) {
      const url = `http://localhost:3000/platforms/${platform_type}/${bot_id}/${scammer_unique_id}?message_id=${message_id}&direction=${direction}`;
      window.location.href = url;
    }
  
    setAnchorEl(null);
  };
  

  const handleMarkAllAsRead = async () => {
    try {
      if (activeTab === 2) {
        const updatedDeletedAlerts = deletedAlerts.map((alert) => ({
          ...alert,
          read_status: true,
        }));
        setDeletedAlerts(updatedDeletedAlerts);
      } else {
        await markAllAlertsAsRead();
        setAlerts((alerts) =>
          alerts.map((alert) => ({ ...alert, read_status: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to mark all alerts as read:", error);
    }
    setAnchorEl(null);
  };

  const handleMarkAsUnread = async (alert) => {
    try {
      await markAlertAsUnread(alert.id);
      const updateFunction = activeTab === 2 ? setDeletedAlerts : setAlerts;
      const updatedAlerts = (activeTab === 2 ? deletedAlerts : alerts).map(
        (a) =>
          a.id === alert.id ? { ...a, read_status: false } : a
      );
      updateFunction(updatedAlerts);

      if (activeTab !== 2) {
        setUnreadCount(updatedAlerts.filter((a) => !a.read_status).length);
      }
    } catch (error) {
      console.error("Failed to mark alert as unread:", error);
    }
  };

  const handleMarkAsReadFromContext = async (alert) => {
    try {
      await markAlertAsRead(alert.id);
      const updateFunction = activeTab === 2 ? setDeletedAlerts : setAlerts;
      const updatedAlerts = (activeTab === 2 ? deletedAlerts : alerts).map(
        (a) =>
          a.id === alert.id ? { ...a, read_status: true } : a
      );
      updateFunction(updatedAlerts);

      if (activeTab !== 2) {
        setUnreadCount(updatedAlerts.filter((a) => !a.read_status).length);
      }
    } catch (error) {
      console.error("Failed to mark alert as read:", error);
    }
  };

  const handleDeleteAlert = async (alert) => {
    try {
      await deleteAlert(alert.id);
      setAlerts(alerts.filter((a) => a.id !== alert.id));
      setDeletedAlerts([...deletedAlerts, { ...alert, active: false }]);

      if (!alert.read_status) {
        setUnreadCount((prevCount) => prevCount - 1);
      }
    } catch (error) {
      console.error("Failed to delete alert:", error);
    }
  };

  const handleRestoreAlert = async (alert) => {
    try {
      await restoreAlert(alert.id);
      setDeletedAlerts(deletedAlerts.filter((a) => a.id !== alert.id));
      setAlerts([...alerts, { ...alert, active: true }]);
    } catch (error) {
      console.error("Failed to restore alert:", error);
    }
  };

  const getFilteredAlerts = () => {
    if (activeTab === 0) {
      return alerts.filter((alert) => !alert.read_status);
    } else if (activeTab === 2) {
      return deletedAlerts;
    } else {
      return alerts;
    }
  };

  return (
    <>
      <IconButton
        type="button"
        sx={{ p: 1 }}
        aria-label="alerts"
        onClick={handleAlertClick}
        className={unreadCount > 0 ? "alarm" : ""}
      >
        <Badge badgeContent={unreadCount} color="error">
          <AlertOutlinedIcon />
        </Badge>
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleAlertClose}>
        <Box p={2} minWidth="300px">
          <Typography variant="h6">Alerts</Typography>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            TabIndicatorProps={{
              style: {
                backgroundColor: "white",
              },
            }}
            sx={{
              ".MuiTab-root": {
                minWidth: "unset",
                flex: 1,
                color: "white",
                "&.Mui-selected": {
                  color: "white",
                },
              },
            }}
          >
            <Tab label="Unread" />
            <Tab label="All" />
            <Tab label="Deleted" />
          </Tabs>
          <Divider />
          <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
            {getFilteredAlerts().length === 0 ? (
              <Typography variant="body2" sx={{ mt: 2 }}>
                No alerts.
              </Typography>
            ) : (
              getFilteredAlerts().map((alert) => (
                <Tooltip
                  key={alert.id}
                  title={`Alert type: ${alert.alert_type}`}
                  arrow
                >
                  <MenuItem onClick={() => handleAlertItemClick(alert)}>
                    <ListItemIcon>
                      <CircleIcon
                        sx={{
                          color: alert.read_status ? "#888888" : "#ff0000",
                          fontSize: 12,
                        }}
                      />
                    </ListItemIcon>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2">
                        {alert.alert_type === "manual_intervention_required"
                          ? `Manual intervention required for bot ${alert.bot_id} on ${alert.platform_type}`
                          : alert.alert_type === "edited_message"
                          ? `Message '${alert.message_text}' was edited by ${alert.scammer_unique_id}`
                          : `Message '${alert.message_text}' was deleted by ${alert.scammer_unique_id}`}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {alert.alert_type === "edited_message" && alert.edited_timestamp ? (
                          <>
                            {`Edited at: ${formatTimestamp(alert.edited_timestamp)}`}
                            <Typography
                              component="span"
                              sx={{ color: "red", fontStyle: "italic" }}
                            >
                              {" "}
                              (Original: {formatTimestamp(alert.timestamp)})
                            </Typography>
                          </>
                        ) : (
                          formatTimestamp(alert.timestamp)
                        )}
                      </Typography>
                    </Box>
                    <Box>
                      <Tooltip
                        title={alert.read_status ? "Mark as unread" : "Mark as read"}
                      >
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            alert.read_status
                              ? handleMarkAsUnread(alert)
                              : handleMarkAsReadFromContext(alert);
                          }}
                          sx={{ color: alert.read_status ? "gray" : "green" }}
                        >
                          {alert.read_status ? (
                            <MailOutlineIcon />
                          ) : (
                            <MailIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={
                          activeTab === 2 ? "Restore alert" : "Delete alert"
                        }
                      >
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            activeTab === 2
                              ? handleRestoreAlert(alert)
                              : handleDeleteAlert(alert);
                          }}
                          sx={{ color: activeTab === 2 ? "limegreen" : "red" }}
                        >
                          {activeTab === 2 ? (
                            <RefreshIcon />
                          ) : (
                            <DeleteIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </MenuItem>
                </Tooltip>
              ))
            )}
          </Box>
          {(activeTab === 2 ? deletedAlerts.length > 0 : alerts.length > 0) && (
            <Box mt={2} sx={{ position: "sticky", bottom: 0 }}>
              <Divider />
              <MenuItem onClick={handleMarkAllAsRead}>
                <Typography variant="body2">Mark all as read</Typography>
              </MenuItem>
            </Box>
          )}
        </Box>
      </Menu>
    </>
  );
};

export default AlertsMenu;
