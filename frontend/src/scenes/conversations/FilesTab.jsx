import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Checkbox,
  Button,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Image as ImageIcon,
  Audiotrack as AudiotrackIcon,
  Videocam as VideocamIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Description as DescriptionIcon,
  InsertDriveFile as InsertDriveFileIcon,
} from "@mui/icons-material";
import { HOST_URL } from "../../api";

/**
 * Renders a tab displaying files related to a conversation, with options for download and preview.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.files - Array of file objects to display.
 * @param {Function} props.onViewFile - Function to handle viewing a file.
 * @param {boolean} props.downloadable - Indicates if files are downloadable.
 * @returns {JSX.Element} - FilesTab component.
 */
const FilesTab = ({ files, onViewFile, downloadable }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  /**
   * Handles checkbox change for selecting files.
   *
   * @param {Object} file - File object.
   */
  const handleCheckboxChange = (file) => {
    const selectedIndex = selectedFiles.indexOf(file);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedFiles, file);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedFiles.slice(1));
    } else if (selectedIndex === selectedFiles.length - 1) {
      newSelected = newSelected.concat(selectedFiles.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedFiles.slice(0, selectedIndex),
        selectedFiles.slice(selectedIndex + 1)
      );
    }

    setSelectedFiles(newSelected);
  };

  /**
   * Checks if a file is selected.
   *
   * @param {Object} file - File object.
   * @returns {boolean} - True if file is selected, false otherwise.
   */
  const isSelected = (file) => selectedFiles.indexOf(file) !== -1;

  /**
   * Initiates download of a file.
   *
   * @param {string} filePath - Path to the file.
   */
  const onDownloadFile = (filePath) => {
    const link = document.createElement("a");
    // link.href = `http://localhost:5000/${filePath}?download=${downloadable}`;
    link.href = `${HOST_URL}${filePath}?download=${downloadable}`;
    link.download = true;
    link.click();
  };

  /**
   * Handles download of selected files.
   */
  const handleDownloadSelected = async () => {
    const selectedFilePaths = selectedFiles.map((file) => file.filePath);
    await downloadFiles(selectedFilePaths);
  };

  /**
   * Handles download of all files in the conversation.
   */
  const handleDownloadAll = async () => {
    const allFilePaths = files.map((file) => file.filePath);
    await downloadFiles(allFilePaths);
  };

  /**
   * Downloads files by sending a POST request to the server.
   *
   * @param {Array<string>} filePaths - Array of file paths to download.
   */
  const downloadFiles = async (filePaths) => {
    try {
      const response = await fetch(`${HOST_URL}download/zip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePaths }),
      });
      const { zipFileUrl } = await response.json();
      if (zipFileUrl) {
        // Trigger download of the zip file
        const link = document.createElement("a");
        link.href = zipFileUrl;
        link.download = true;
        link.click();
      } else {
        console.error("Failed to generate zip file");
      }
    } catch (error) {
      console.error("Error downloading files:", error);
    }
  };

  /**
   * Renders a preview icon based on file type.
   *
   * @param {string} filePath - Path to the file.
   * @param {string} fileType - MIME type of the file.
   * @returns {JSX.Element} - Preview icon.
   */
  const renderFilePreview = (filePath, fileType) => {
    const fullPath = `http://localhost:5000/${filePath}`;

    if (fileType.startsWith("image/")) {
      return <ImageIcon style={{ marginRight: 10 }} />;
    } else if (fileType.startsWith("audio/")) {
      return <AudiotrackIcon style={{ marginRight: 10 }} />;
    } else if (fileType.startsWith("video/")) {
      return <VideocamIcon style={{ marginRight: 10 }} />;
    } else if (fileType === "application/pdf") {
      return <PictureAsPdfIcon style={{ marginRight: 10 }} />;
    } else if (fileType === "text/plain") {
      return <DescriptionIcon style={{ marginRight: 10 }} />;
    } else {
      return <InsertDriveFileIcon style={{ marginRight: 10 }} />;
    }
  };

  return (
    <Box margin="20px" width="80%">
      <Typography variant="h6" gutterBottom>
        Files in Conversation
      </Typography>
      <Box display="flex" alignItems="center" marginBottom={1}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadSelected}
          disabled={selectedFiles.length === 0}
          style={{ marginRight: 10 }}
        >
          Download Selected
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadAll}
          style={{ marginRight: 10 }}
        >
          Download All
        </Button>
      </Box>
      <List>
        {files.map((file, index) => (
          <ListItem
            key={index}
            divider
            button
            onClick={() => handleCheckboxChange(file)}
          >
            <Checkbox
              checked={isSelected(file)}
              onChange={() => handleCheckboxChange(file)}
            />
            {renderFilePreview(file.filePath, file.fileType)}
            <ListItemText primary={file.fileName} />
            <IconButton onClick={() => onDownloadFile(file.filePath)}>
              <DownloadIcon />
            </IconButton>
            <IconButton onClick={() => onViewFile(file.messageId)}>
              <VisibilityIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FilesTab;
