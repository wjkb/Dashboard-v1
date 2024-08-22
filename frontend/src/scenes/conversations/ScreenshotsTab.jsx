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
   * Renders screenshots with click handler to open in lightbox.
   * @param {string} filePath 
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
            cursor: 'pointer', 
          }}
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
          mainSrc={`${HOST_URL}${screenshots[photoIndex].file_path}`}
          nextSrc={`${HOST_URL}${screenshots[(photoIndex + 1) % screenshots.length].file_path}`}
          prevSrc={`${HOST_URL}${screenshots[(photoIndex + screenshots.length - 1) % screenshots.length].file_path}`}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + screenshots.length - 1) % screenshots.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % screenshots.length)
          }
          imageTitle={`Image ${photoIndex + 1} of ${screenshots.length}`}
          imageCaption=""
          reactModalStyle={{
            overlay: {
              zIndex: 2000, 
            },
            content: {
              background: 'transparent', 
            }
          }}
        />
      )}
    </Box>
  );
};

export default ScreenshotsTab;
