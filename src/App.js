import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Form from "./scenes/form";
// import Team from "./scenes/Team";
import PlatformSidebar from "./scenes/platforms";
import FacebookBotsSidebar from "./scenes/platforms/FacebookBotsSidebar";

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
                <Route path="facebook" element={<FacebookBotsSidebar />} />
                {/* <Route path="whatsapp" element={<WhatsAppBotsSidebar />} />
                <Route path="telegram" element={<TelegramBotsSidebar />} /> */}
              </Route>
              <Route path="/addbot" element={<Form />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
