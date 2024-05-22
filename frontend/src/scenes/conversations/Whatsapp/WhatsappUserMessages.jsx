import React, { useEffect, useState } from "react";
import { Box, useTheme, List, ListItem, ListItemText } from "@mui/material";
import { tokens } from "../../../theme";
import { useParams } from "react-router-dom";
import { getBotConversationMessages } from "../../../api";
import Header from "../../../components/Header";

const WhatsappUserMessages = () => {
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
          "whatsapp",
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

  return (
    <Box margin="20px" width="80%">
      <Header
        title={`Messages with ${userId}`}
        subtitle="Conversation details"
      />
      <Box height="75vh">
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index} alignItems="flex-start">
              <ListItemText
                primary={
                  msg.direction === "incoming"
                    ? `User: ${msg.message}`
                    : `Bot: ${msg.message}`
                }
                secondary={msg.timestamp}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default WhatsappUserMessages;
