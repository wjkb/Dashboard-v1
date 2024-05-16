import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import PlatformSidebar from "./scenes/platforms";
import FacebookBots from "./scenes/platformBots/FacebookBots";
import WhatsappBots from "./scenes/platformBots/WhatsappBots";
import TelegramBots from "./scenes/platformBots/TelegramBots";
import ManageBots from "./scenes/manageBots";
import Form from "./scenes/form";
import FacebookBotConversations from "./scenes/platformBots/FacebookBotConversations";
import FacebookUserMessages from "./scenes/platformBots/FacebookUserMessages";

function App() {
  const [theme, colorMode] = useMode();

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
                <Route path="facebook" element={<FacebookBots />}>
                  <Route path=":botId" element={<FacebookBotConversations />}>
                    <Route path=":userId" element={<FacebookUserMessages />} />
                  </Route>
                </Route>
                <Route path="whatsapp" element={<WhatsappBots />} />
                <Route path="telegram" element={<TelegramBots />} />
              </Route>
              <Route path="/managebots" element={<ManageBots />} />
              <Route path="/addbot" element={<Form />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
