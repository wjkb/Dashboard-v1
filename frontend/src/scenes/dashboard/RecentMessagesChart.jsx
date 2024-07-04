import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { tokens } from "../../theme";
import { getRecentMessages } from "../../graphApi";

const RecentMessagesChart = ({ platform }) => {
  const colors = tokens;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const recentMessages = await getRecentMessages(platform);
        setMessages(recentMessages);
      } catch (error) {
        console.error("Error fetching recent messages:", error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: colors.primary,
        padding: 2,
        borderRadius: 2,
        boxShadow: 3,
        maxHeight: 400,
        overflowY: "auto",
      }}
    >
      {messages.map((message) => (
        <Box
          key={message.id}
          sx={{
            marginBottom: 2,
            padding: 2,
            backgroundColor:
              message.direction === "incoming"
                ? colors.greenAccent
                : colors.grey[100],
            borderRadius: 2,
            color: colors.black,
          }}
        >
          <Typography variant="body2" color={colors.grey[500]}>
            {new Date(message.timestamp).toLocaleString()}
          </Typography>
          <Typography variant="body1">{message.message}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default RecentMessagesChart;
