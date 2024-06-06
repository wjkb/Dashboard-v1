import React, { useEffect, useState } from "react";
import {
  Box,
  useTheme,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import { tokens } from "../../../theme";
import { useParams } from "react-router-dom";
import { getBotConversationMessages } from "../../../api";
import Header from "../../../components/Header";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import VideocamIcon from "@mui/icons-material/Videocam";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const TelegramUserMessages = () => {
  const { botId, userId } = useParams();
  const theme = useTheme();
  const colors = tokens;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesData = await getBotConversationMessages(
          "telegram",
          botId,
          userId
        );
        setMessages(messagesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [botId, userId]);

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

  const renderFile = (filePath, fileType) => {
    const fullPath = `http://localhost:5000/${filePath}`;
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
    <Box margin="20px" width="80%">
      <Header
        title={`Messages with ${userId}`}
        subtitle="Conversation details"
      />
      <Box height="75vh" display="flex" flexDirection="column" overflow="auto">
        <List>
          {messages.map((msg, index) => (
            <ListItem
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems:
                  msg.direction === "incoming" ? "flex-start" : "flex-end",
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
                {msg.message && (
                  <Typography variant="body1">{msg.message}</Typography>
                )}
                <Typography variant="caption" color={colors.grey[500]}>
                  {formatDateTime(msg.timestamp)}
                </Typography>
              </Paper>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default TelegramUserMessages;
