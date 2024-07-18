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
} from "@mui/icons-material";
import { tokens } from "../../theme";

/**
 * Renders a tab displaying messages with various media types and file attachments.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.messages - Array of message objects to display.
 * @param {Object} props.messageRefs - Refs to messages for scrolling.
 * @param {string | number | null} props.highlightedMessage - ID of the highlighted message.
 * @returns {JSX.Element} - MessagesTab component.
 */
const MessagesTab = ({ messages, messageRefs, highlightedMessage }) => {
  const filteredMessages = messages.filter(
    (message) =>
      message.response_status === null ||
      message.response_status.toLowerCase() === "sent"
  );

  const theme = useTheme();
  const colors = tokens;

  // Styles for message types
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

  /**
   * Formats timestamp to a readable date and time format.
   *
   * @param {number} timestamp - Unix timestamp.
   * @returns {string} - Formatted date and time string.
   */
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDateTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    return formattedDateTime;
  };

  /**
   * Renders different file types based on their MIME type.
   *
   * @param {string} filePath - Path to the file.
   * @param {string} fileType - MIME type of the file.
   * @param {boolean} [download=false] - Indicates if the file should be downloadable.
   * @returns {JSX.Element} - File preview or download link.
   */
  const renderFile = (filePath, fileType, download = false) => {
    const fullPath = `http://localhost:5000/${filePath}?download=${download}`;
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
    <Box overflow="auto">
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
                <Typography variant="body1">{msg.message_text}</Typography>
              )}
              <Typography variant="caption" color={colors.grey[500]}>
                {formatDateTime(msg.message_timestamp)}
              </Typography>
            </Paper>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MessagesTab;
