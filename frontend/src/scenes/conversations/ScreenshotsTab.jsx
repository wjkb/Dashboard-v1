import React from "react";
import {
  Box,
  useTheme,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import {
  Image as ImageIcon,
  Audiotrack as AudiotrackIcon,
  Videocam as VideocamIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Description as DescriptionIcon,
  InsertDriveFile as InsertDriveFileIcon,
} from "@mui/icons-material";
import { tokens } from "../../theme";
import { HOST_URL } from "../../api";

/**
 * Renders a tab displaying screenshots of the conversation.
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.screenshots - Array of screenshot objects to display.
 * @returns {JSX.Element} - ScreenshotsTab component.
 */
const ScreenshotsTab = ({ screenshots }) => {
  const theme = useTheme();
  const colors = tokens;

  /**
   * Renders different file types based on their MIME type.
   *
   * @param {string} filePath - Path to the file.
   * @param {string} fileType - MIME type of the file.
   * @param {boolean} [download=false] - Indicates if the file should be downloadable.
   * @returns {JSX.Element} - File preview or download link.
   */
  const renderFile = (filePath, fileType, download = false) => {
    // const fullPath = `http://localhost:5000/${filePath}?download=${download}`;
    const fullPath = `${HOST_URL}${filePath}?download=${download}`;
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
    <Box overflow="auto">
      <List>
        {screenshots.map((screenshot, index) => (
          <ListItem
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Paper
              elevation={1}
              sx={{
                padding: theme.spacing(1),
                borderRadius: theme.shape.borderRadius,
                maxWidth: "60%",
              }}
            >
              {screenshot.file_path &&
                renderFile(screenshot.file_path, "image/jpeg")}
            </Paper>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ScreenshotsTab;
