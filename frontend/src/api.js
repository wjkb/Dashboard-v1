const API_URL = "http://localhost:5000/api";

export const getBots = async () => {
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

export const getConversations = async (platform) => {
  const response = await fetch(`${API_URL}/conversations/${platform}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
};
