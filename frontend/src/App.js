import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import PlatformSidebar from "./scenes/platforms";
// import FacebookBots from "./scenes/platformBots/FacebookBots";
// import WhatsappBots from "./scenes/platformBots/WhatsappBots";
// import TelegramBots from "./scenes/platformBots/TelegramBots";
// import FacebookBotConversations from "./scenes/conversations/Facebook/FacebookBotConversations";
// import WhatsappBotConversations from "./scenes/conversations/Whatsapp/WhatsappBotConversations";
// import TelegramBotConversations from "./scenes/conversations/Telegram/TelegramBotConversations";
// import FacebookUserMessages from "./scenes/conversations/Facebook/FacebookUserMessages";
// import WhatsappUserMessages from "./scenes/conversations/Whatsapp/WhatsappUserMessages";
// import TelegramUserMessages from "./scenes/conversations/Telegram/TelegramUserMessages";
import PlatformBots from "./scenes/platformBots/PlatformBots";
import PlatformBotConversations from "./scenes/conversations/PlatformBotConversations";
import PlatformUserMessages from "./scenes/conversations/PlatformUserMessages";
import ManageBots from "./scenes/manageBots";
import ManualSendForm from "./scenes/manualSend";
import AddBotForm from "./scenes/addBot";

function App() {
  const [theme, colorMode] = useMode();
  // You can add more platforms dynamically in the future by adding to the platforms array below
  const platforms = ["Facebook", "WhatsApp", "Telegram"];

  const generatePlatformRoutes = (platform) => (
    <Route
      key={platform}
      path={platform.toLowerCase()}
      element={<PlatformBots platform={platform} />}
    >
      <Route
        path=":botId"
        element={<PlatformBotConversations platform={platform} />}
      >
        <Route
          path=":scammerUniqueId"
          element={<PlatformUserMessages platform={platform} />}
        />
      </Route>
    </Route>
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar />
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/platforms" element={<PlatformSidebar />}>
                {platforms.map(generatePlatformRoutes)}
              </Route>
              <Route path="/managebots" element={<ManageBots />} />
              <Route path="/manual-send" element={<ManualSendForm />} />
              <Route path="/addbot" element={<AddBotForm />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
