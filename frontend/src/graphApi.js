/**
 * This file is used to store some of the APIs used to display graphs in the dashboard.
 */

const API_URL = "http://localhost:5000/api";

// Get Conversation Count
export const getConversationCount = async () => {
  try {
    const response = await fetch(`${API_URL}/conversation_count`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

// Get Message Count
export const getMessageCount = async () => {
  try {
    const response = await fetch(`${API_URL}/message_count`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

// Get Recent Messages on Selected Platform
export const getRecentMessages = async (platform) => {
  try {
    const response = await fetch(`${API_URL}/recent_messages/${platform}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};
