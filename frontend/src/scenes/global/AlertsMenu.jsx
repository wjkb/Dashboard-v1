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
} from "@mui/material";
import AlertOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { getAlerts, markAlertAsRead, markAllAlertsAsRead, markAlertAsUnread } from "../../api"; // Ensure you have the correct API functions
import CircleIcon from "@mui/icons-material/FiberManualRecord"; // Icon for the purple circle
import { tokens } from "../../theme"; // Assuming theme.js is in the parent folder

const AlertsMenu = () => {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { alerts, unread_count } = await getAlerts();
        setAlerts(alerts);
        setUnreadCount(unread_count);
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

  const handleAlertItemClick = async (alertId) => {
    try {
      await markAlertAsRead(alertId); // Mark the alert as read in the backend
      setAlerts(alerts.map(alert =>
        alert.id === alertId ? { ...alert, read_status: true } : alert
      ));
      setUnreadCount(prevCount => prevCount - 1); // Decrease the unread count
    } catch (error) {
      console.error("Failed to mark alert as read:", error);
    }
    setAnchorEl(null);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAlertsAsRead();
      setAlerts(alerts.map(alert => ({ ...alert, read_status: true })));
      setUnreadCount(0); // Reset unread count to 0
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
        await markAlertAsUnread(selectedAlert.id); // Assuming you have this API call implemented
        setAlerts(alerts.map(alert =>
          alert.id === selectedAlert.id ? { ...alert, read_status: false } : alert
        ));
        setUnreadCount(prevCount => prevCount + 1); // Increase the unread count
      } catch (error) {
        console.error("Failed to mark alert as unread:", error);
      }
    }
    setContextMenu(null);
  };

  return (
    <>
      <IconButton type="button" sx={{ p: 1 }} aria-label="alerts" onClick={handleAlertClick}>
        <Badge badgeContent={unreadCount} color="error">
          <AlertOutlinedIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleAlertClose}
      >
        <Box p={2} minWidth="300px">
          <Typography variant="h6">Alerts</Typography>
          <Divider />
          {alerts.length === 0 ? (
            <Typography variant="body2" sx={{ mt: 2 }}>
              No alerts.
            </Typography>
          ) : (
            alerts.map((alert) => (
              <MenuItem
                key={alert.id}
                onClick={() => handleAlertItemClick(alert.id)} // Handle click to mark as read
                onContextMenu={(e) => handleRightClick(e, alert)} // Capture right-click event
              >
                {!alert.read_status && (
                  <ListItemIcon>
                    <CircleIcon sx={{ color: tokens.primary, fontSize: 12 }} />
                  </ListItemIcon>
                )}
                <Typography variant="body2">{alert.alert_message}</Typography>
              </MenuItem>
            ))
          )}
          {alerts.length > 0 && (
            <Box mt={2}>
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
        <MenuItem onClick={handleMarkAsUnread}>Mark as unread</MenuItem>
      </Menu>
    </>
  );
};

export default AlertsMenu;
