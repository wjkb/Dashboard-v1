import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  useTheme,
  List,
  ListItem,
  Paper,
  Typography,
  Tab,
  Tabs,
} from "@mui/material";
import {
  Image as ImageIcon,
  Audiotrack as AudiotrackIcon,
  Videocam as VideocamIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Description as DescriptionIcon,
  InsertDriveFile as InsertDriveFileIcon,
} from "@mui/icons-material";
import { tokens } from "../../../theme";
import { useParams } from "react-router-dom";
import { getBotConversationMessages } from "../../../api";
import Header from "../../../components/Header";
import FilesTab from "../FilesTab";

const FacebookUserMessages = () => {
  const { botId, userId } = useParams();
  const theme = useTheme();
  const colors = tokens;
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const messageRefs = useRef({});
  const [highlightedMessage, setHighlightedMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesData = await getBotConversationMessages(
          "facebook",
          botId,
          userId
        );
        setMessages(messagesData);
        setFiles(
          messagesData
            .filter((msg) => msg.file_path)
            .map((msg) => ({
              filePath: msg.file_path,
              fileName: msg.file_path.split("/").pop(),
              messageId: msg.id,
            }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [botId, userId]);

  const handleViewFile = (messageId) => {
    setTabValue(0); // Switch back to the messages tab
    setTimeout(() => {
      if (messageRefs.current[messageId]) {
        messageRefs.current[messageId].scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        setHighlightedMessage(messageId);
        setTimeout(() => {
          setHighlightedMessage(null);
        }, 1000);
      }
    }, 500);
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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

  return (
    <Box margin="20px" width="80%">
      <Header
        title={`Messages with ${userId}`}
        subtitle="Conversation details"
      />
      <Box height="75vh" display="flex" flexDirection="column">
        <Tabs value={tabValue} onChange={handleChangeTab}>
          <Tab label="Messages" />
          <Tab label="Files" />
        </Tabs>
        {tabValue === 0 ? (
          <Box overflow="auto">
            <List>
              {messages.map((msg, index) => (
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
                    <Typography variant="body1">{msg.message}</Typography>
                    {msg.file_path &&
                      renderFile(msg.file_path, msg.file_type, theme, false)}
                    <Typography variant="caption" color={colors.grey[500]}>
                      {formatDateTime(msg.timestamp)}
                    </Typography>
                  </Paper>
                </ListItem>
              ))}
            </List>
          </Box>
        ) : (
          <FilesTab files={files} onViewFile={handleViewFile} downloadable />
        )}
      </Box>
    </Box>
  );
};

const renderFile = (filePath, fileType, theme, download) => {
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

export default FacebookUserMessages;
