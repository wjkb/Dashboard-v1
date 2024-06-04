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

const FacebookUserMessages = () => {
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
          "facebook",
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

  return (
    <Box margin="20px" width="80%">
      <Header
        title={`Messages with ${userId}`}
        subtitle="Conversation details"
      />
      <Box height="75vh" display="flex" flexDirection="column">
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
                {msg.file_path && (
                  <img
                    src={`http://localhost:5000/${msg.file_path}`}
                    alt="Message attachment"
                    style={{ maxWidth: "100%", marginBottom: theme.spacing(1) }}
                  />
                )}
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

export default FacebookUserMessages;
