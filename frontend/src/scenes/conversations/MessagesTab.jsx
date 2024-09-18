import React, { useState, useEffect, useRef } from "react";
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
import { HOST_URL, getEditedMessage, getConversationDetails } from "../../api";  

const MessagesTab = ({ messages, messageRefs, highlightedMessage }) => {
  const [selectedMessages, setSelectedMessages] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editedMessagesMap, setEditedMessagesMap] = useState({});
  const fetchedMessageIdsRef = useRef(new Set());
  const [conversationDetails, setConversationDetails] = useState(null);  
  const theme = useTheme();
  const colors = tokens;

  // Derive conversation_id from the first message
  const conversationId = messages.length > 0 ? messages[0].conversation_id : null;

  useEffect(() => {
    const fetchEditedMessages = async (msg) => {
      try {
        setLoading(true);
        setError(null);

        const data = await getEditedMessage(
          msg.platform_type,
          msg.conversation_id,
          msg.message_id,
          msg.direction
        );

        const fetchedEditedMessages = data.edited_messages || [];

        setEditedMessagesMap((prev) => ({
          ...prev,
          [msg.message_id]: fetchedEditedMessages,
        }));

        fetchedMessageIdsRef.current.add(msg.message_id);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.message);
      }
    };

    // Find edited messages and fetch their edits
    messages.forEach((msg) => {
      if (
        msg.response_status?.toLowerCase() === "edited" &&
        !fetchedMessageIdsRef.current.has(msg.message_id)
      ) {
        fetchEditedMessages(msg);
      }
    });
  }, [messages]);

  // Fetch conversation details to handle previous and next conversations
  useEffect(() => {
    if (conversationId) {
      const fetchConversationDetails = async () => {
        try {
          setLoading(true);
          const details = await getConversationDetails(conversationId);
          setConversationDetails(details);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          setError(error.message);
        }
      };

      fetchConversationDetails();
    }
  }, [conversationId]);

  const handleViewMore = (msg) => {
    setSelectedMessages((prevSelectedMessages) =>
      prevSelectedMessages.includes(msg.message_id)
        ? prevSelectedMessages.filter((id) => id !== msg.message_id)
        : [...prevSelectedMessages, msg.message_id] 
    );
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

  const handleRedirect = (conversation) => {
    const url = `http://localhost:3000/platforms/${conversation.platform}/${conversation.bot_id}/${conversation.scammer_unique_id}`;
    window.location.href = url;
  };

  return (
    <Box sx={{ height: "70vh", overflowY: "auto" }}>
      {loading && <Typography variant="body2">Loading...</Typography>}
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}

      {conversationDetails && conversationDetails.previous_conversation && (
        <Typography color="error" variant="body2" gutterBottom>
          This conversation was moved from another platform. Click{" "}
          <Link
            component="button"
            underline="hover"
            onClick={() => handleRedirect(conversationDetails.previous_conversation)}
            sx={{ textDecoration: 'underline', color: 'white' }}
          >
            here
          </Link>{" "}
          to view.
        </Typography>
      )}

      <List>
        {messages.map((msg, index) => {
          const isEdited = msg.response_status?.toLowerCase() === "edited";
          const mostRecentEdit = isEdited
            ? editedMessagesMap[msg.message_id]?.[0]
            : null;

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
                  highlightedMessage === msg.id || 
                  (highlightedMessage && highlightedMessage.message_id === msg.message_id && highlightedMessage.direction === msg.direction)
                    ? "yellow"
                    : "inherit",
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
                    {selectedMessages.includes(msg.message_id) &&
                      editedMessagesMap[msg.message_id]?.length > 0 && (
                        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                          <Table size="small">
                            <TableBody>
                              {editedMessagesMap[msg.message_id].map(
                                (edit, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>
                                      {idx ===
                                      editedMessagesMap[msg.message_id].length - 1
                                        ? `Original Message (${new Date(
                                            edit.previous_timestamp ||
                                              msg.message_timestamp
                                          ).toLocaleString()}):`
                                        : `Edited Message (${new Date(
                                            edit.previous_timestamp
                                          ).toLocaleString()}):`}
                                    </TableCell>

                                    <TableCell>
                                      {edit.original_message_text}
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
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

      {conversationDetails && conversationDetails.next_conversation && (
        <Typography color="error" variant="body2" gutterBottom>
          This conversation has moved to another platform. Click{" "}
          <Link
            component="button"
            underline="hover"
            onClick={() => handleRedirect(conversationDetails.next_conversation)}
            sx={{ textDecoration: 'underline', color: 'white' }}
          >
            here
          </Link>{" "}
          to view.
        </Typography>
      )}
    </Box>
  );
};

export default MessagesTab;
