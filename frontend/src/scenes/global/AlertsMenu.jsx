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
} from "@mui/material";
import AlertOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { getAlerts, markAlertAsRead, markAllAlertsAsRead, markAlertAsUnread } from "../../api"; 
import CircleIcon from "@mui/icons-material/FiberManualRecord";
import "./AlertsMenu.css";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString(); // You can adjust the format here
};

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

  const handleAlertItemClick = async (alert) => {
    try {
      await markAlertAsRead(alert.id);
      const updatedAlerts = alerts.map((a) =>
        a.id === alert.id ? { ...a, read_status: true } : a
      );
      setAlerts(updatedAlerts);
      setUnreadCount(updatedAlerts.filter(a => !a.read_status).length);
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
      await markAllAlertsAsRead();
      setAlerts((alerts) => alerts.map((alert) => ({ ...alert, read_status: true })));
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
        setAlerts(updatedAlerts);
        setUnreadCount(updatedAlerts.filter(a => !a.read_status).length);
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
        const updatedAlerts = alerts.map((alert) =>
          alert.id === selectedAlert.id ? { ...alert, read_status: true } : alert
        );
        setAlerts(updatedAlerts);
        setUnreadCount(updatedAlerts.filter(a => !a.read_status).length);
      } catch (error) {
        console.error("Failed to mark alert as read:", error);
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
        className={unreadCount > 0 ? 'alarm' : ''} 
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
        {!selectedAlert?.read_status && (
          <MenuItem onClick={handleMarkAsReadFromContext}>Mark as read</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default AlertsMenu;
