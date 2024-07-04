import React from "react";
import {
  Box,
  useTheme,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import { tokens } from "../../theme";

const ExtractedInformationTab = ({ extractedInformation }) => {
  const theme = useTheme();
  const colors = tokens;

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Extracted Information
      </Typography>
      <Paper>
        <List>
          {extractedInformation.map((info, index) => (
            <ListItem key={index}>
              <Box p={2}>
                <Typography variant="body1">
                  <strong>{info.key}</strong>: {info.value}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ExtractedInformationTab;
