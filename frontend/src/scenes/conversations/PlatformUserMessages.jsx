import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";
import {
  getBot,
  getBotConversationMessages,
  getBotConversationExtractedInformation,
  getBotConversationScreenshots,
  toggleBotPause,
  sendProactiveMessage,
} from "../../api";
import Header from "../../components/Header";
import MessagesTab from "./MessagesTab";
import FilesTab from "./FilesTab";
import ExtractedInformationTab from "./ExtractedInformationTab";
import ScreenshotsTab from "./ScreenshotsTab";
import { tokens } from "../../theme";

// Constants for tab values
const TAB_MESSAGES = 0;
const TAB_FILES = 1;
const TAB_EXTRACTED_INFORMATION = 2;
const TAB_SCREENSHOTS = 3;

/**
 * Component to display messages and files of a Platform (i.e. Facebook, Whatsapp, etc.) bot conversation with a specific user.
 *
 * @returns {JSX.Element} The PlatformUserMessages component.
 */
const PlatformUserMessages = ({ platform }) => {
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
  const [openSendMessageDialog, setOpenSendMessageDialog] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [openPauseDialog, setOpenPauseDialog] = useState(false);
  const [openResumeDialog, setOpenResumeDialog] = useState(false);
  const [pauseResumeMessages, setPauseResumeMessages] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseButtonDisabled, setPauseButtonDisabled] = useState(false);

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
        platform,
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
        platform,
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
        platform,
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

  const handlePauseorResumeBot = async (action) => {
    try {
      await toggleBotPause(botId);
      fetchBot();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSendMessage = async () => {
    try {
      await sendProactiveMessage(botId, scammerUniqueId, platform, messageText);
      setOpenSendMessageDialog(false);
      setMessageText("");
      fetchMessages();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenSendMessageDialog = () => {
    setOpenSendMessageDialog(true);
  };

  const handleCloseSendMessageDialog = () => {
    setOpenSendMessageDialog(false);
    setMessageText("");
  };

  const handleOpenPauseDialog = () => {
    setPauseResumeMessages(getPauseResumeMessages());
    setOpenPauseDialog(true);
  };

  const handleClosePauseDialog = () => {
    setOpenPauseDialog(false);
  };

  const handleOpenResumeDialog = () => {
    setPauseResumeMessages(getPauseResumeMessages());
    setOpenResumeDialog(true);
  };

  const handleCloseResumeDialog = () => {
    setOpenResumeDialog(false);
  };

  const handleConfirmPause = () => {
    handlePauseorResumeBot("pause");
    setIsPaused(true);
    setOpenPauseDialog(false);
  };

  const handleConfirmResume = () => {
    handlePauseorResumeBot("resume");
    setIsPaused(false);
    setOpenResumeDialog(false);
    setPauseButtonDisabled(true);
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

  const getPauseResumeMessages = () => {
    const incomingMessages = [];
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].direction === "outgoing") {
        break;
      }
      incomingMessages.unshift(messages[i]);
    }
    return incomingMessages;
  };

  useEffect(() => {
    if (!isPaused && pauseButtonDisabled) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.direction === "outgoing") {
        setPauseButtonDisabled(false);
      }
    }
  }, [messages, isPaused, pauseButtonDisabled]);

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
        onClick={
          bot
            ? bot.pause
              ? handleOpenResumeDialog
              : handleOpenPauseDialog
            : null
        }
        style={{ marginBottom: "10px", marginLeft: "10px" }}
        disabled={pauseButtonDisabled && !isPaused}
      >
        {bot ? (bot.pause ? "Resume Bot" : "Pause Bot") : "Loading..."}
      </Button>
      {bot && bot.pause && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenSendMessageDialog}
          style={{ marginBottom: "10px", marginLeft: "10px" }}
        >
          Send Message
        </Button>
      )}

      <Dialog
        open={openPauseDialog}
        onClose={handleClosePauseDialog}
        aria-labelledby="pause-dialog-title"
        aria-describedby="pause-dialog-description"
      >
        <DialogTitle id="pause-dialog-title">Pause Bot</DialogTitle>
        <DialogContent>
          <DialogContentText id="pause-dialog-description">
            The following incoming messages are pending responses. The bot will
            be paused until these messages are processed:
          </DialogContentText>
          <ul>
            {pauseResumeMessages.map((msg) => (
              <li key={msg.message_id}>{msg.message_text}</li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClosePauseDialog}
            color="primary"
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmPause}
            color="primary"
            variant="contained"
            autoFocus
          >
            Confirm Pause
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openResumeDialog}
        onClose={handleCloseResumeDialog}
        aria-labelledby="resume-dialog-title"
        aria-describedby="resume-dialog-description"
      >
        <DialogTitle id="resume-dialog-title">Resume Bot</DialogTitle>
        <DialogContent>
          <DialogContentText id="resume-dialog-description">
            The bot will resume processing the following incoming messages
            without responses:
          </DialogContentText>
          <ul>
            {pauseResumeMessages.map((msg) => (
              <li key={msg.message_id}>{msg.message_text}</li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseResumeDialog}
            color="primary"
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmResume}
            color="primary"
            variant="contained"
            autoFocus
          >
            Confirm Resume
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openSendMessageDialog}
        onClose={handleCloseSendMessageDialog}
        PaperProps={{ style: { width: "80%" } }}
        aria-labelledby="send-message-dialog-title"
        aria-describedby="send-message-dialog-description"
      >
        <DialogTitle id="send-message-dialog-title">Send Message</DialogTitle>
        <DialogContent>
          <DialogContentText id="send-message-dialog-description">
            Type your message below:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="messageText"
            label="Message"
            type="text"
            fullWidth
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            multiline
            rows={4}
            maxRows={10}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSendMessageDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSendMessage} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <Tabs value={tabValue} onChange={handleChangeTab}>
        <Tab label="Messages" />
        <Tab label="Files" />
        <Tab label="Extracted Information" />
        <Tab label="Screenshots" />
      </Tabs>
      {shownTab}
    </Box>
  );
};

export default PlatformUserMessages;
