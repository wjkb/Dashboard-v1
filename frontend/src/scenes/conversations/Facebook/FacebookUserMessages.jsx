import { Box, useTheme, List, ListItem, ListItemText } from "@mui/material";
import { tokens } from "../../../theme";
import { useParams } from "react-router-dom";
import { facebookConversations } from "../../../data/mockData";
import Header from "../../../components/Header";

const FacebookUserMessages = () => {
  const { botId, userId } = useParams();
  const theme = useTheme();
  const colors = tokens;

  const botConversations = facebookConversations.find(
    (conv) => conv.botId === parseInt(botId)
  );
  const userConversation = botConversations?.conversations.find(
    (conv) => conv.user === userId
  );

  return (
    <Box margin="20px" width="80%">
      <Header
        title={`Messages with ${userId}`}
        subtitle="Conversation details"
      />
      <Box height="75vh">
        <List>
          {userConversation?.messages.map((msg, index) => (
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

export default FacebookUserMessages;
