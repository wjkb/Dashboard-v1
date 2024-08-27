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
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await getAlerts();
        if (data) {
          const { alerts = [], unread_count = 0 } = data;
          const activeAlerts = alerts.filter(alert => alert.active);
          const inactiveAlerts = alerts.filter(alert => !alert.active);

          setAlerts(activeAlerts);
          setDeletedAlerts(inactiveAlerts);
          setUnreadCount(activeAlerts.filter(alert => !alert.read_status).length);
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

    if (alert.link) {
      window.location.href = alert.link;
    } else if (alert.platform_type && alert.bot_id && alert.scammer_unique_id) {
      const url = `http://localhost:3000/platforms/${alert.platform_type}/${alert.bot_id}/${alert.scammer_unique_id}`;
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

  const handleRightClick = (event, alert) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
    setSelectedAlert(alert);
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleMarkAsUnread = async () => {
    if (selectedAlert) {
      try {
        await markAlertAsUnread(selectedAlert.id);
        const updateFunction = activeTab === 2 ? setDeletedAlerts : setAlerts;
        const updatedAlerts = (activeTab === 2 ? deletedAlerts : alerts).map((alert) =>
          alert.id === selectedAlert.id ? { ...alert, read_status: false } : alert
        );
        updateFunction(updatedAlerts);
        if (activeTab !== 2) {
          setUnreadCount(updatedAlerts.filter((a) => !a.read_status).length);
        }
      } catch (error) {
        console.error("Failed to mark alert as unread:", error);
      }
    }
    setContextMenu(null);
  };

  const handleMarkAsReadFromContext = async () => {
    if (selectedAlert) {
      try {
        await markAlertAsRead(selectedAlert.id);
        const updateFunction = activeTab === 2 ? setDeletedAlerts : setAlerts;
        const updatedAlerts = (activeTab === 2 ? deletedAlerts : alerts).map((alert) =>
          alert.id === selectedAlert.id ? { ...alert, read_status: true } : alert
        );
        updateFunction(updatedAlerts);
        if (activeTab !== 2) {
          setUnreadCount(updatedAlerts.filter((a) => !a.read_status).length);
        }
      } catch (error) {
        console.error("Failed to mark alert as read:", error);
      }
    }
    setContextMenu(null);
  };

  const handleDeleteAlert = async () => {
    if (selectedAlert) {
      try {
        await deleteAlert(selectedAlert.id);
        setAlerts(alerts.filter((alert) => alert.id !== selectedAlert.id));
        setDeletedAlerts([...deletedAlerts, { ...selectedAlert, active: false }]);

        if (!selectedAlert.read_status) {
          setUnreadCount((prevCount) => prevCount - 1);
        }
      } catch (error) {
        console.error("Failed to delete alert:", error);
      }
    }
    setContextMenu(null);
  };

  const handleRestoreAlert = async () => {
    if (selectedAlert) {
      try {
        await restoreAlert(selectedAlert.id);
        setDeletedAlerts(deletedAlerts.filter(alert => alert.id !== selectedAlert.id));
        setAlerts([...alerts, { ...selectedAlert, active: true }]);
      } catch (error) {
        console.error("Failed to restore alert:", error);
      }
    }
    setContextMenu(null);
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
                  <MenuItem
                    onClick={() => handleAlertItemClick(alert)}
                    onContextMenu={(e) => handleRightClick(e, alert)}
                  >
                    {!alert.read_status && (
                      <ListItemIcon>
                        <CircleIcon sx={{ color: '#ff0000', fontSize: 12 }} />
                      </ListItemIcon>
                    )}
                    <Box>
                      <Typography variant="body2">
                        {alert.alert_type === 'manual_intervention_required' 
                          ? `Manual intervention required for bot ${alert.bot_id} for ${alert.platform_type}`
                          : `Message '${alert.message_text}' was deleted by ${alert.scammer_unique_id}`
                        }
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {formatTimestamp(alert.timestamp)}
                      </Typography>
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

      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        {selectedAlert?.read_status ? (
          <MenuItem onClick={handleMarkAsUnread}>Mark as unread</MenuItem>
        ) : (
          <MenuItem onClick={handleMarkAsReadFromContext}>Mark as read</MenuItem>
        )}
        {activeTab !== 2 && (
          <MenuItem onClick={handleDeleteAlert}>Delete alert</MenuItem>
        )}
        {activeTab === 2 && (
          <MenuItem onClick={handleRestoreAlert}>Restore alert</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default AlertsMenu;
