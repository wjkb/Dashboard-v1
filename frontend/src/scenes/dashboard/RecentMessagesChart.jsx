import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { tokens } from "../../theme";
import { getRecentMessages } from "../../graphApi";
import LinkIcon from "@mui/icons-material/Link";
import { useNavigate } from "react-router-dom";

const RecentMessagesChart = ({ platform }) => {
  const colors = tokens;
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

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
  }, [platform]);

  const handleIconClick = (botId, user) => {
    const url = `/platforms/${platform.toLowerCase()}/${botId}/${user}`;
    navigate(url);
  };

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
            position: "relative",
          }}
        >
          <Typography variant="body2" color={colors.grey[500]} gutterBottom>
            {new Date(message.message_timestamp).toLocaleString()}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {message.message_text}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="caption"
              color={colors.grey[700]}
              sx={{
                textDecoration:
                  message.direction === "outgoing" ? "underline" : "none",
                textDecorationColor:
                  message.direction === "outgoing" ? "red" : "transparent",
              }}
            >
              Bot ID: {message.bot_id}
            </Typography>
            <Typography
              variant="caption"
              color={colors.grey[700]}
              sx={{
                textDecoration:
                  message.direction === "incoming" ? "underline" : "none",
                textDecorationColor:
                  message.direction === "incoming" ? "red" : "transparent",
              }}
            >
              User: {message.scammer_unique_id}
            </Typography>
            <Typography variant="caption" color={colors.grey[500]}>
              {message.direction}
            </Typography>
            <IconButton
              onClick={() => handleIconClick(message.bot_id, message.user)}
              sx={{
                position: "absolute",
                top: 2,
                right: 2,
                color: colors.grey[700],
              }}
            >
              <LinkIcon />
            </IconButton>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default RecentMessagesChart;
