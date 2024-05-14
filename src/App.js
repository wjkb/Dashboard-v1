import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import PlatformSidebar from "./scenes/platforms";
import FacebookBots from "./scenes/platformBots/FacebookBots";
import WhatsappBotsSidebar from "./scenes/platformBots/WhatsappBots";
import TelegramBotsSidebar from "./scenes/platformBots/TelegramBots";
import ManageBots from "./scenes/manageBots";
import Form from "./scenes/form";

function App() {
  const [theme, colorMode] = useMode();
  const [selectedPlatform, setSelectedPlatform] = useState(null);

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
                <Route path="facebook" element={<FacebookBots />} />
                <Route path="whatsapp" element={<WhatsappBotsSidebar />} />
                <Route path="telegram" element={<TelegramBotsSidebar />} />
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
