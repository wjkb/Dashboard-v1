import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  List,
  ListItem,
  Paper,
  Typography,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
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
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editedMessages, setEditedMessages] = useState([]);

  const theme = useTheme();
  const colors = tokens;

  useEffect(() => {
    const fetchEditedMessages = async (msg) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${HOST_URL}/api/messages/edited_message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            platform_type: msg.platform_type,
            conversation_id: msg.conversation_id,
            message_id: msg.message_id,
            direction: msg.direction,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch the edited messages.");
        }

        const data = await response.json();
        const fetchedEditedMessages = data.edited_messages || [];

        if (Array.isArray(fetchedEditedMessages)) {
          fetchedEditedMessages.sort(
            (a, b) => new Date(b.edited_timestamp) - new Date(a.edited_timestamp)
          );
          setEditedMessages(fetchedEditedMessages);
        } else {
          setEditedMessages([]);
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.message);
      }
    };

    messages.forEach((msg) => {
      if (msg.response_status?.toLowerCase() === "edited") {
        fetchEditedMessages(msg);
      }
    });
  }, [messages]);

  const handleViewMore = (msg) => {
    setSelectedMessage(msg.message_id);
  };

  const renderFile = (filePath, fileType) => {
    const fullPath = `${HOST_URL}${filePath}`;
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
        {messages.map((msg, index) => {
          const isEdited = msg.response_status?.toLowerCase() === "edited";
          const mostRecentEdit = isEdited ? editedMessages[0] : null;

          return (
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
                  backgroundColor:
                    msg.direction === "incoming"
                      ? colors.grey[100]
                      : colors.greenAccent,
                }}
              >
                {msg.file_path && renderFile(msg.file_path, msg.file_type)}
                <Typography
                  variant="body1"
                  sx={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    color: "black",
                  }}
                >
                  {isEdited && mostRecentEdit
                    ? mostRecentEdit.edited_message_text
                    : msg.message_text}
                </Typography>
                
                {msg.response_status?.toLowerCase() === "deleted" && (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ fontStyle: "italic", marginTop: theme.spacing(1) }}
                >
                  This message has been deleted
                </Typography>
              )}

                {isEdited && (
                  <>
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{ fontStyle: "italic", marginTop: theme.spacing(1) }}
                    >
                      This message has been edited. Click{" "}
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => handleViewMore(msg)}
                        sx={{
                          fontStyle: "italic",
                          color: "primary.main",
                          cursor: "pointer",
                        }}
                      >
                        here
                      </Link>{" "}
                      to view more
                    </Typography>
                    {selectedMessage === msg.message_id &&
                      editedMessages.length > 0 && (
                        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                          <Table size="small">
                            <TableBody>
                              {editedMessages.map((edit, idx) => (
                                <TableRow key={idx}>
                                  <TableCell sx={{ color: "white" }}>
                                    {idx === editedMessages.length - 1
                                      ? `Original Message (${new Date(
                                          edit.previous_timestamp
                                        ).toLocaleString()}):`
                                      : `Edited Message (${new Date(
                                          edit.previous_timestamp
                                        ).toLocaleString()}):`}
                                  </TableCell>
                                  <TableCell sx={{ color: "white" }}>
                                    {edit.original_message_text}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                  </>
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
                    {isEdited && mostRecentEdit
                      ? `Edited at ${new Date(
                          mostRecentEdit.edited_timestamp
                        ).toLocaleString()}`
                      : new Date(msg.message_timestamp).toLocaleString()}
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
          );
        })}
      </List>
      {loading && <Typography variant="body2">Loading...</Typography>}
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default MessagesTab;
