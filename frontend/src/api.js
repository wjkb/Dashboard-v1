const API_URL = "http://localhost:5000/api";

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
