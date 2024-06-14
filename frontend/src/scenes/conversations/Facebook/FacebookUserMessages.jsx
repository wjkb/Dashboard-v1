import React, { useEffect, useState, useRef } from "react";
import { Box, Tabs, Tab, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { getBotConversationMessages } from "../../../api";
import Header from "../../../components/Header";
import FilesTab from "../FilesTab";
import MessagesTab from "../MessagesTab";
import { tokens } from "../../../theme";

const FacebookUserMessages = () => {
  const { botId, userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const messageRefs = useRef({});
  const [highlightedMessage, setHighlightedMessage] = useState(null);

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
            fileType: msg.file_type,
            messageId: msg.id,
          }))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [botId, userId]);

  const handleRefresh = () => {
    setLoading(true);
    fetchMessages();
  };

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

  return (
    <Box margin="20px" width="80%">
      <Header
        title={`Messages with ${userId}`}
        subtitle="Conversation details"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleRefresh}
        style={{ marginBottom: "10px" }}
      >
        Refresh Messages
      </Button>
      <Box height="75vh" display="flex" flexDirection="column">
        <Tabs value={tabValue} onChange={handleChangeTab}>
          <Tab label="Messages" />
          <Tab label="Files" />
        </Tabs>
        {tabValue === 0 ? (
          <MessagesTab
            messages={messages}
            messageRefs={messageRefs}
            highlightedMessage={highlightedMessage}
            handleViewFile={handleViewFile}
          />
        ) : (
          <FilesTab files={files} onViewFile={handleViewFile} downloadable />
        )}
      </Box>
    </Box>
  );
};

export default FacebookUserMessages;
