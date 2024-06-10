import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";

const FilesTab = ({ files, onViewFile, downloadable }) => {
  const handleDownload = (filePath) => {
    const link = document.createElement("a");
    link.href = `http://localhost:5000/${filePath}?download=${downloadable}`;
    link.download = true;
    link.click();
  };

  return (
    <Box margin="20px" width="80%">
      <Typography variant="h6" gutterBottom>
        Files in Conversation
      </Typography>
      <List>
        {files.map((file, index) => (
          <ListItem key={index} divider>
            <ListItemText primary={file.fileName} />
            <IconButton onClick={() => handleDownload(file.filePath)}>
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
