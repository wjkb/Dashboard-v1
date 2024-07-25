import React, { useEffect, useState, useRef } from "react";
import { Box, Tabs, Tab, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import {
  getBot,
  getBotConversationMessages,
  getBotConversationExtractedInformation,
  getBotConversationScreenshots,
  toggleBotPause,
} from "../../../api";
import Header from "../../../components/Header";
import MessagesTab from "../MessagesTab";
import FilesTab from "../FilesTab";
import ExtractedInformationTab from "../ExtractedInformationTab";
import ScreenshotsTab from "../ScreenshotsTab";
import { tokens } from "../../../theme";

// Constants for tab values
const TAB_MESSAGES = 0;
const TAB_FILES = 1;
const TAB_EXTRACTED_INFORMATION = 2;
const TAB_SCREENSHOTS = 3;

/**
 * Component to display messages and files of a WhatsApp bot conversation with a specific user.
 *
 * @returns {JSX.Element} The WhatsappUserMessages component.
 */
const WhatsappUserMessages = () => {
  const { botId, scammerUniqueId } = useParams();
  const [bot, setBot] = useState(null);
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]);
  const [screenshots, setScreenshots] = useState([]);
  const [extractedInformation, setExtractedInformation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(TAB_MESSAGES);
  const messageRefs = useRef({});
  const [highlightedMessage, setHighlightedMessage] = useState(null);

  /**
   * Fetches bot details
   */
  const fetchBot = async () => {
    try {
      const bot = await getBot(botId);
      setBot(bot);
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Fetches messages and files from the API for the current bot and user.
   */
  const fetchMessages = async () => {
    try {
      const messagesData = await getBotConversationMessages(
        "whatsapp",
        botId,
        scammerUniqueId
      );
      // Extract files from messages
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

  /**
   * Fetches extracted information from the API for the current bot and user.
   */
  const fetchExtractedInformation = async () => {
    try {
      const extractedInformation = await getBotConversationExtractedInformation(
        "whatsapp",
        botId,
        scammerUniqueId
      );
      // Set extracted information state
      setExtractedInformation(extractedInformation);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches screenshots from the API for the current bot and user.
   */
  const fetchScreenshots = async () => {
    try {
      const screenshots = await getBotConversationScreenshots(
        "whatsapp",
        botId,
        scammerUniqueId
      );
      setScreenshots(screenshots);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBot();
    fetchMessages();
    fetchExtractedInformation();
    fetchScreenshots();

    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [botId, scammerUniqueId]);

  const handleRefresh = () => {
    setLoading(true);
    fetchMessages();
  };

  const handlePauseorResumeBot = async () => {
    try {
      await toggleBotPause(botId);
      fetchBot();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewFile = (messageId) => {
    setTabValue(TAB_MESSAGES); // Switch back to the messages tab
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

  var shownTab =
    tabValue === TAB_MESSAGES ? (
      <MessagesTab
        messages={messages}
        messageRefs={messageRefs}
        highlightedMessage={highlightedMessage}
      />
    ) : tabValue === TAB_FILES ? (
      <FilesTab files={files} onViewFile={handleViewFile} downloadable />
    ) : tabValue === TAB_EXTRACTED_INFORMATION ? (
      <ExtractedInformationTab extractedInformation={extractedInformation} />
    ) : tabValue === TAB_SCREENSHOTS ? (
      <ScreenshotsTab screenshots={screenshots} />
    ) : null;

  return (
    <Box margin="20px" width="80%">
      <Header
        title={`Messages with ${scammerUniqueId}`}
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
      <Button
        variant="contained"
        color="primary"
        onClick={handlePauseorResumeBot}
        style={{ marginBottom: "10px", marginLeft: "10px" }}
      >
        {bot ? (bot.pause ? "Resume Bot" : "Pause Bot") : "Loading..."}
      </Button>

      <Box height="75vh" display="flex" flexDirection="column">
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Messages" />
          <Tab label="Files" />
          <Tab label="Extracted Information" />
          <Tab label="Screenshots" />
        </Tabs>
        {shownTab}
      </Box>
    </Box>
  );
};

export default WhatsappUserMessages;
