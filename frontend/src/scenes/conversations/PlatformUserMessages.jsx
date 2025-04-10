import React, { useEffect, useState, useRef, useCallback} from "react";
import { useLocation } from 'react-router-dom'; // Import useLocation to access query parameters
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
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useParams } from "react-router-dom";
import {
  getBot,
  getBotConversationMessages,
  getBotConversationExtractedInformation,
  getBotConversationScreenshots,
  getConversationPauseStatus,
  toggleConversationPause,
  downloadEverything,
  llmIgnorePreviousMessages,
  sendProactiveMessage,
} from "../../api";
import Header from "../../components/Header";
import MessagesTab from "./MessagesTab";
import FilesTab from "./FilesTab";
import ExtractedInformationTab from "./ExtractedInformationTab";
import ScreenshotsTab from "./ScreenshotsTab";

// Constants for tab values
const TAB_MESSAGES = 0;
const TAB_FILES = 1;
const TAB_EXTRACTED_INFORMATION = -999; // Change this to 2 and TAB_SCREENSHOTS to 3 when re-enabling Extracted Information Tab
const TAB_SCREENSHOTS = 2;

const PlatformUserMessages = ({ platform }) => {
  const location = useLocation(); // Hook to get query parameters
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
  const [openConfirmIgnoreDialog, setOpenConfirmIgnoreDialog] = useState(false);
  const searchParams = new URLSearchParams(location.search); // Access query parameters
  const messageIdFromAlert = searchParams.get("message_id");
  const directionFromAlert = searchParams.get("direction");

  useEffect(() => {
    // Reset state when botId or scammerUniqueId changes
    setBot(null);
    setMessages([]);
    setFiles([]);
    setScreenshots([]);
    setExtractedInformation([]);
    setLoading(true);
    setError(null);
    setTabValue(TAB_MESSAGES);
    setHighlightedMessage(null);
    setOpenSendMessageDialog(false);
    setMessageText("");
    setOpenPauseDialog(false);
    setOpenResumeDialog(false);
    setPauseResumeMessages([]);
    setIsPaused(false);
    setPauseButtonDisabled(false);

    // Fetch data on component mount
    fetchBot();
    fetchMessages();
    fetchExtractedInformation();
    fetchScreenshots();
    checkConversationPauseStatus(platform, botId, scammerUniqueId);

    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [botId, scammerUniqueId]);

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
   * Check if platform is paused
   */
  const checkConversationPauseStatus = async (platform, botId, scammerUniqueId) => {
    try {
      const pause_status = await getConversationPauseStatus(
        platform,
        botId,
        scammerUniqueId
      );
      setIsPaused(pause_status.pause); // Updated to pause_status.pause
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

  const handleRefresh = () => {
    setLoading(true);
    fetchMessages();
    fetchExtractedInformation();
    fetchScreenshots();
    checkConversationPauseStatus(platform, botId, scammerUniqueId);
  };

  const handleDownloadEverything = async () => {
    try {
      const response = await downloadEverything(platform, botId, scammerUniqueId);
      const { zipFileUrl } = response;
      if (zipFileUrl) {
        const link = document.createElement("a");
        link.href = zipFileUrl;
        link.download = true;
        link.click();
      } else {
        throw new Error("Error downloading files");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLLMIgnorePreviousMessages = async () => {
    try {
      await llmIgnorePreviousMessages(platform, botId, scammerUniqueId);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenConfirmIgnoreDialog = () => {
    setOpenConfirmIgnoreDialog(true);
  };

  const handleCloseConfirmIgnoreDialog = () => {
    setOpenConfirmIgnoreDialog(false);
  };

  const handleConfirmIgnore = async () => {
    setOpenConfirmIgnoreDialog(false);
    setLoading(true);
    await handleLLMIgnorePreviousMessages();
    setLoading(false);
  };

  const handlePauseorResumeBot = async () => {
    try {
      await toggleConversationPause(platform, botId, scammerUniqueId);
      setIsPaused(!isPaused); // Toggle the isPaused state
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
    handlePauseorResumeBot();
    setOpenPauseDialog(false);
  };

  const handleConfirmResume = () => {
    handlePauseorResumeBot();
    setPauseButtonDisabled(true);
    setOpenResumeDialog(false);
  };

  const handleViewAlert = useCallback(() => {
    setTabValue(TAB_MESSAGES); // Switch to the Messages tab
    setTimeout(() => {
      const matchingMessage = messages.find(
        (msg) => msg.message_id === messageIdFromAlert && msg.direction === directionFromAlert
      );

      if (matchingMessage && messageRefs.current[matchingMessage.id]) {
        messageRefs.current[matchingMessage.id].scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        setHighlightedMessage(matchingMessage.id);
        setTimeout(() => {
          setHighlightedMessage(null);
        }, 1000);
      }
    }, 500);
  }, [messages, messageIdFromAlert, directionFromAlert]);

    useEffect(() => {
      if (messages.length > 0 && messageIdFromAlert && directionFromAlert) {
        handleViewAlert();
      }
    }, [messages, messageIdFromAlert, directionFromAlert, handleViewAlert]);

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
    <div style={{ height: "80%", paddingTop: "20px" }}>
      <Header
        title={`Messages with ${scammerUniqueId}`}
        subtitle="Conversation details"
      />
      <Box marginBottom="10px">
        <Button
          variant="contained"
          color="primary"
          onClick={handleRefresh}
          style={{ marginRight: "10px" }}
        >
          <RefreshIcon />
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadEverything}
          style={{ marginRight: "10px" }}
        >
          <DownloadIcon />
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleOpenConfirmIgnoreDialog}
        >
          Ignore Message History
        </Button>
      </Box>

      <Box marginBottom="10px">
        <Button
          variant="contained"
          color="primary"
          onClick={
            bot
              ? isPaused
                ? handleOpenResumeDialog
                : handleOpenPauseDialog
              : null
          }
          style={{ marginRight: "10px" }}
          disabled={pauseButtonDisabled && !isPaused}
        >
          {bot ? (
            <Box display="flex" alignItems="center" justifyContent="flex-start">
              {isPaused ? (
                <>
                  <PlayArrowIcon style={{ marginRight: "5px" }} />
                  Resume Conversation
                </>
              ) : (
                <>
                  <PauseIcon style={{ marginRight: "5px" }} />
                  Pause Conversation
                </>
              )}
            </Box>
          ) : (
            "Loading..."
          )}
        </Button>
        {bot && isPaused && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenSendMessageDialog}
          >
            Send Message
          </Button>
        )}
      </Box>

      {/* Dialogs and Tabs remain the same */}

      <Dialog
        open={openConfirmIgnoreDialog}
        onClose={handleCloseConfirmIgnoreDialog}
        aria-labelledby="ignore-dialog-title"
        arua-describedby="ignore-dialog-description"
      >
        <DialogTitle>Confirm Ignore Message History</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want the bot to ignore the message history? This
            will make the bot ignore previous messages used for context to
            generate responses, and this action is not reversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmIgnoreDialog}
            sx={{ color: "white", backgroundColor: "#9c27b0", "&:hover": { backgroundColor: "#ab47bc" } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmIgnore}
            sx={{ color: "white", backgroundColor: "#f44336", "&:hover": { backgroundColor: "#e57373" } }}
          >
            Ignore History
          </Button>
        </DialogActions>
      </Dialog>

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
            sx={{ color: "white", backgroundColor: "#9c27b0", "&:hover": { backgroundColor: "#ab47bc" } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmPause}
            sx={{ color: "white", backgroundColor: "#9c27b0", "&:hover": { backgroundColor: "#ab47bc" } }}
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
            sx={{ color: "white", backgroundColor: "#9c27b0", "&:hover": { backgroundColor: "#ab47bc" } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmResume}
            sx={{ color: "white", backgroundColor: "#9c27b0", "&:hover": { backgroundColor: "#ab47bc" } }}
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
          <Button
            onClick={handleCloseSendMessageDialog}
            sx={{ color: "white", backgroundColor: "#9c27b0", "&:hover": { backgroundColor: "#ab47bc" } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendMessage}
            sx={{ color: "white", backgroundColor: "#9c27b0", "&:hover": { backgroundColor: "#ab47bc" } }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <Tabs value={tabValue} onChange={handleChangeTab}>
        <Tab
          label="Messages"
          sx={{
            "&.Mui-selected": {
              backgroundColor: "#D3D3D3", // Light grey background
              fontWeight: "bold", // Bold text
              borderRadius: "2px", // Slightly rounded corners
            },
          }}
        />
        <Tab
          label="Files"
          sx={{
            "&.Mui-selected": {
              backgroundColor: "#D3D3D3", // Light grey background
              fontWeight: "bold", // Bold text
              borderRadius: "2px", // Slightly rounded corners
            },
          }}
        />
        <Tab
          label="Screenshots"
          sx={{
            "&.Mui-selected": {
              backgroundColor: "#D3D3D3", // Light grey background
              fontWeight: "bold", // Bold text
              borderRadius: "2px", // Slightly rounded corners
            },
          }}
        />
      </Tabs>
      {shownTab}
    </div>
  );
};

export default PlatformUserMessages;
