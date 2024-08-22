import React from "react";
import {
  Box,
  useTheme,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import {
  Image as ImageIcon,
  Audiotrack as AudiotrackIcon,
  Videocam as VideocamIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Description as DescriptionIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import { tokens } from "../../theme";
import { HOST_URL } from "../../api";

const MessagesTab = ({ messages, messageRefs, highlightedMessage }) => {
  const filteredMessages = messages.filter(
    (message) =>
      message.response_status === null ||
      message.response_status.toLowerCase() === "sending" ||
      message.response_status.toLowerCase() === "sent" ||
      message.response_status.toLowerCase() === "failed" ||
      message.response_status.toLowerCase() === "deleted"
  );

  const theme = useTheme();
  const colors = tokens;

  const messageStyles = {
    incoming: {
      backgroundColor: colors.grey[100],
      color: colors.black,
      marginRight: "auto",
    },
    outgoing: {
      backgroundColor: colors.greenAccent,
      color: colors.black,
      marginLeft: "auto",
    },
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDateTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    return formattedDateTime;
  };

  const renderFile = (filePath, fileType, download = false) => {
    const fullPath = `${HOST_URL}${filePath}?download=${download}`;
    const fileName = filePath.split("/").pop();

    if (fileType.startsWith("image/")) {
      return (
        <Box display="flex" flexDirection="column">
          <ImageIcon style={{ marginRight: theme.spacing(1) }} />
          <img
            src={fullPath}
            alt="Attachment"
            style={{ maxWidth: "100%", marginBottom: theme.spacing(1) }}
          />
        </Box>
      );
    } else if (fileType.startsWith("audio/")) {
      return (
        <Box display="flex" flexDirection="column">
          <AudiotrackIcon style={{ marginRight: theme.spacing(1) }} />
          <audio
            controls
            src={fullPath}
            style={{ maxWidth: "100%", marginBottom: theme.spacing(1) }}
          />
        </Box>
      );
    } else if (fileType.startsWith("video/")) {
      return (
        <Box display="flex" flexDirection="column">
          <VideocamIcon style={{ marginRight: theme.spacing(1) }} />
          <video
            controls
            src={fullPath}
            style={{ maxWidth: "100%", marginBottom: theme.spacing(1) }}
          />
        </Box>
      );
    } else if (fileType === "application/pdf") {
      return (
        <a
          href={fullPath}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <PictureAsPdfIcon style={{ marginRight: theme.spacing(1) }} />
          <Typography variant="body2" color="primary">
            {fileName}
          </Typography>
        </a>
      );
    } else if (fileType === "text/plain") {
      return (
        <a
          href={fullPath}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <DescriptionIcon style={{ marginRight: theme.spacing(1) }} />
          <Typography variant="body2" color="primary">
            {fileName}
          </Typography>
        </a>
      );
    } else {
      return (
        <a
          href={fullPath}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <InsertDriveFileIcon style={{ marginRight: theme.spacing(1) }} />
          <Typography variant="body2" color="primary">
            {fileName}
          </Typography>
        </a>
      );
    }
  };

  return (
    <Box sx={{ height: "70vh", overflowY: "auto" }}>
      <List>
        {filteredMessages.map((msg, index) => (
          <ListItem
            key={index}
            ref={(el) => (messageRefs.current[msg.id] = el)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems:
                msg.direction === "incoming" ? "flex-start" : "flex-end",
              backgroundColor:
                highlightedMessage === msg.id ? "yellow" : "inherit",
              transition: "background-color 0.5s ease",
              position: "relative",
            }}
          >
            <Paper
              elevation={1}
              sx={{
                padding: theme.spacing(1),
                borderRadius: theme.shape.borderRadius,
                maxWidth: "60%",
                ...messageStyles[msg.direction],
              }}
            >
              {msg.file_path && renderFile(msg.file_path, msg.file_type)}
              {msg.message_text && (
                <Typography
                  variant="body1"
                  sx={{
                    wordBreak: "break-word", 
                    overflowWrap: "break-word", 
                  }}
                >
                  {msg.message_text}
                </Typography>
              )}
              {msg.response_status?.toLowerCase() === "deleted" && (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ fontStyle: "italic", marginTop: theme.spacing(1) }}
                >
                  This message has been deleted
                </Typography>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: theme.spacing(1),
                }}
              >
                <Typography variant="caption" color={colors.grey[500]}>
                  {formatDateTime(msg.message_timestamp)}
                </Typography>
                {msg.direction === "outgoing" && msg.response_status && (
                  <>
                    {msg.response_status.toLowerCase() === "sending" && (
                      <PendingIcon fontSize="small" />
                    )}
                    {msg.response_status.toLowerCase() === "sent" && (
                      <CheckCircleIcon
                        fontSize="small"
                        color="success"
                        sx={{ marginLeft: theme.spacing(1) }}
                      />
                    )}
                    {msg.response_status.toLowerCase() === "failed" && (
                      <CloseIcon
                        fontSize="small"
                        color="error"
                        sx={{ marginLeft: theme.spacing(1) }}
                      />
                    )}
                  </>
                )}
              </Box>
            </Paper>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MessagesTab;
