import { Box, Typography } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import PieChart from "./PieChart";
import ConversationCountBarChart from "./ConversationCountBarChart";
import MessageCountBarChart from "./MessageCountBarChart";
import RecentMessagesChart from "./RecentMessagesChart";

const Dashboard = () => {
  const colors = tokens;

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Dashboard" subtitle="Welcome to your dashboard!" />
      </Box>

      {/* Grids */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* Pie Chart for Active vs. Deactivated Bots */}
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={colors.primary}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Bots
          </Typography>
          <Box height="250px" mt="-20px">
            <PieChart />
          </Box>
        </Box>

        {/* Bar Chart for Conversation Count by Platform */}
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={colors.primary}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Conversation Count by Platform
          </Typography>
          <Box height="250px" mt="-20px">
            <ConversationCountBarChart />
          </Box>
        </Box>

        {/* Bar Chart for Message Count by Platform */}
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={colors.primary}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Message Count by Platform
          </Typography>
          <Box height="250px" mt="-20px">
            <MessageCountBarChart />
          </Box>
        </Box>

        {/* Recent Messages on Facebook */}
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={colors.primary}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 30px 30px" }}
          >
            Recent Facebook Messages
          </Typography>
          <Box height="250px">
            <RecentMessagesChart platform="facebook" />
          </Box>
        </Box>

        {/* Recent Messages on WhatsApp */}
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={colors.primary}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 30px 30px" }}
          >
            Recent WhatsApp Messages
          </Typography>
          <Box height="250px">
            <RecentMessagesChart platform="whatsapp" />
          </Box>
        </Box>

        {/* Recent Messages on Telegram */}
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={colors.primary}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 30px 30px" }}
          >
            Recent Telegram Messages
          </Typography>
          <Box height="250px">
            <RecentMessagesChart platform="telegram" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
