const API_URL = "http://localhost:5000/api";

// GET APIs
export const getAllBots = async () => {
  try {
    const response = await fetch(`${API_URL}/bots`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

export const getPlatformBots = async (platform) => {
  try {
    const response = await fetch(`${API_URL}/${platform}/bots`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

export const getBotConversations = async (platform, botId) => {
  try {
    const response = await fetch(
      `${API_URL}/${platform}/bots/${botId}/conversations`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

export const getBotConversationMessages = async (
  platform,
  botId,
  scammerUniqueId
) => {
  try {
    const response = await fetch(
      `${API_URL}/${platform}/bots/${botId}/conversations/${scammerUniqueId}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

export const getBotConversationExtractedInformation = async (
  platform,
  botId,
  scammerUniqueId
) => {
  try {
    const response = await fetch(
      `${API_URL}/${platform}/bots/${botId}/conversations/${scammerUniqueId}/extracted_information`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

// POST APIs
export const createBot = async (botData) => {
  try {
    const response = await fetch(`${API_URL}/bots`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(botData),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error creating bot: ${error.message}`);
  }
};

export const sendBot = async (botPhone, targetUrl, platform) => {
  try {
    const response = await fetch(`${API_URL}/start_bot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ botPhone, targetUrl, platform }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error starting bot: ${error.message}`);
  }
};

// PUT APIs
export const editBot = async (botId, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/bots/${botId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error updating bot: ${error.message}`);
  }
};

export const deactivateBot = async (botId) => {
  console.log("deactivateBot");
  try {
    const response = await fetch(`${API_URL}/bots/${botId}/deactivate`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ active: false }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error deactivating bot: ${error.message}`);
  }
};

export const activateBot = async (botId) => {
  try {
    const response = await fetch(`${API_URL}/bots/${botId}/activate`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ active: true }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error activating bot: ${error.message}`);
  }
};

// DELETE APIs
export const deleteBot = async (botId) => {
  try {
    const response = await fetch(`${API_URL}/bots/${botId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error deleting bot: ${error.message}`);
  }
};
