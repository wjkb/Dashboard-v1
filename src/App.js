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
import FacebookBotConversations from "./scenes/conversations/Facebook/FacebookBotConversations";
import WhatsappBotConversations from "./scenes/conversations/Whatsapp/WhatsappBotConversations";
import TelegramBotConversations from "./scenes/conversations/Telegram/TelegramBotConversations";
import FacebookUserMessages from "./scenes/conversations/Facebook/FacebookUserMessages";
import WhatsappUserMessages from "./scenes/conversations/Whatsapp/WhatsappUserMessages";
import TelegramUserMessages from "./scenes/conversations/Telegram/TelegramUserMessages";
import ManageBots from "./scenes/manageBots";
import Form from "./scenes/form";

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
                <Route path="whatsapp" element={<WhatsappBots />}>
                  <Route path=":botId" element={<WhatsappBotConversations />}>
                    <Route path=":userId" element={<WhatsappUserMessages />} />
                  </Route>
                </Route>
                <Route path="telegram" element={<TelegramBots />}>
                  <Route path=":botId" element={<TelegramBotConversations />}>
                    <Route path=":userId" element={<TelegramUserMessages />} />
                  </Route>
                </Route>
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
