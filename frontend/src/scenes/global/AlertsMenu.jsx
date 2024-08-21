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
import { getAlerts, markAlertAsRead, markAllAlertsAsRead, markAlertAsUnread } from "../../api"; 
import CircleIcon from "@mui/icons-material/FiberManualRecord";
import { tokens } from "../../theme";
import "./AlertsMenu.css"; // Assuming you add the CSS in a separate file

const AlertsMenu = () => {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await getAlerts();
        if (data) {
          const { alerts = [], unread_count = 0 } = data;
          setAlerts(alerts);
          setUnreadCount(unread_count);
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

  const handleAlertItemClick = async (alertId) => {
    try {
      await markAlertAsRead(alertId);
      const updatedAlerts = alerts.map((alert) =>
        alert.id === alertId ? { ...alert, read_status: true } : alert
      );
      const unreadAlerts = updatedAlerts.filter(alert => !alert.read_status).length;
      setAlerts(updatedAlerts);
      setUnreadCount(unreadAlerts);
    } catch (error) {
      console.error("Failed to mark alert as read:", error);
    }
    setAnchorEl(null);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAlertsAsRead();
      const updatedAlerts = alerts.map((alert) => ({ ...alert, read_status: true }));
      setAlerts(updatedAlerts);
      setUnreadCount(0);
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
        const updatedAlerts = alerts.map((alert) =>
          alert.id === selectedAlert.id ? { ...alert, read_status: false } : alert
        );
        const unreadAlerts = updatedAlerts.filter(alert => !alert.read_status).length;
        setAlerts(updatedAlerts);
        setUnreadCount(unreadAlerts);
      } catch (error) {
        console.error("Failed to mark alert as unread:", error);
      }
    }
    setContextMenu(null);
  };

  return (
    <>
      <IconButton 
        type="button" 
        sx={{ p: 1 }} 
        aria-label="alerts" 
        onClick={handleAlertClick}
        className={unreadCount > 0 ? 'alarm' : ''} // Apply alarm class conditionally
      >
        <Badge badgeContent={unreadCount} color="error">
          <AlertOutlinedIcon />
        </Badge>
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleAlertClose}>
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
                onClick={() => handleAlertItemClick(alert.id)}
                onContextMenu={(e) => handleRightClick(e, alert)}
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
        {selectedAlert?.read_status && (
          <MenuItem onClick={handleMarkAsUnread}>Mark as unread</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default AlertsMenu;
