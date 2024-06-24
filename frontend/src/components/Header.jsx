import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

/**
 * Header component for displaying a title and a subtitle.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.title - The title to display.
 * @param {string} props.subtitle - The subtitle to display.
 * @returns {JSX.Element} The header component.
 */
const Header = ({ title, subtitle }) => {
  // const theme = useTheme();
  const colors = tokens;
  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ mb: "5px" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.greenAccent}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
