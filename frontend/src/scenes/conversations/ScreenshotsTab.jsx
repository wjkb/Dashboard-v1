import React, { useState } from "react";
import {
  Box,
  useTheme,
  List,
  ListItem,
  Paper,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { tokens } from "../../theme";
import { HOST_URL } from "../../api";

/**
 * Renders a tab displaying screenshots of the conversation.
 * @component
 * @param {Object} props 
 * @param {Array<Object>} props.screenshots 
 * @returns {JSX.Element} 
 */
const ScreenshotsTab = ({ screenshots }) => {
  const theme = useTheme();
  const colors = tokens;
  const [isOpen, setIsOpen] = useState(false); 
  const [photoIndex, setPhotoIndex] = useState(0); 

  /**
   * Opens the lightbox and sets the current photo index.
   * @param {number} index 
   */
  const handleOpenLightbox = (index) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  /**
   * Renders different file types based on their MIME type.
   *
   * @param {string} filePath - 
   * @param {boolean} [download=false] 
   * @returns {JSX.Element} 
   */
  const renderFile = (filePath) => {
    const fullPath = `${HOST_URL}${filePath}`;
    return (
      <Box display="flex" flexDirection="column">
        <ImageIcon style={{ marginRight: theme.spacing(1) }} />
        <img
          src={fullPath}
          alt="Attachment"
          style={{
            maxWidth: "100%",
            marginBottom: theme.spacing(1),
            cursor: 'pointer', //adding cursor pointer to indicate it's clickable
          }}
          //find index of the clicked screenshot and open it in the lightbox
          onClick={() => handleOpenLightbox(screenshots.findIndex(s => s.file_path === filePath))}
        />
      </Box>
    );
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
              {screenshot.file_path && renderFile(screenshot.file_path)}
            </Paper>
          </ListItem>
        ))}
      </List>
      {isOpen && (
        <Lightbox
          //main image to be displayed in the lightbox
          mainSrc={`${HOST_URL}${screenshots[photoIndex].file_path}`}
          //next image in the sequence
          nextSrc={`${HOST_URL}${screenshots[(photoIndex + 1) % screenshots.length].file_path}`}
          //the previous image in the sequence
          prevSrc={`${HOST_URL}${screenshots[(photoIndex + screenshots.length - 1) % screenshots.length].file_path}`}
          //close the lightbox
          onCloseRequest={() => setIsOpen(false)}
          //navigate to the previous image
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + screenshots.length - 1) % screenshots.length)
          }
          //navigate to the next image
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % screenshots.length)
          }
        />
      )}
    </Box>
  );
};

export default ScreenshotsTab;
