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

export const getBotConversationMessages = async (platform, botId, userId) => {
  try {
    const response = await fetch(
      `${API_URL}/${platform}/bots/${botId}/conversations/${userId}`
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
