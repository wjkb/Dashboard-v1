export const HOST_URL = "http://localhost:5000/";
const API_URL = HOST_URL + "api";

// const API_URL = "http://172.16.211.3:5000/api";
// const API_URL = "http://localhost:5000/api";


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

export const getBot = async (botId) => {
  try {
    const response = await fetch(`${API_URL}/bots/${botId}`);
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

export const getBotConversationScreenshots = async (
  platform,
  botId,
  scammerUniqueId
) => {
  try {
    const response = await fetch(
      `${API_URL}/${platform}/bots/${botId}/conversations/${scammerUniqueId}/screenshots`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

export const getAlertsSpecific = async (platform, botId, scammerUniqueId) => {
  try {

    const response = await fetch(`${API_URL}/alerts/get_specific`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "platform": platform,
        "bot_id": botId,
        "scammer_unique_id": scammerUniqueId,
      }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

export const getAlerts = async () => {
  try {
    const response = await fetch(`${API_URL}/alerts/get`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching alerts: ${error.message}`);
  }
};

export const getEditedMessage = async (platform_type, conversation_id, message_id, direction) => {
  try {
    const response = await fetch(
      `${API_URL}/edits/${platform_type}/${conversation_id}/${message_id}/${direction}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching edited messages: ${error.message}`);
  }
};

export const getVictimDetails = async () => {
  try {
    const response = await fetch(`${API_URL}/victim_details_json`);
    if (!response.ok) {
      throw new Error("Failed to load victim details");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error loading victim details: ${error.message}`);
  }
};

export const getConversationPauseStatus = async (platform, botId, scammerUniqueId) => {
  try {
    const response = await fetch(
      `${API_URL}/conversations/${platform}/${botId}/${scammerUniqueId}/pause_status`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch conversation pause status");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching pause status: ${error.message}`);
  }
};

export const getConversationDetails = async (conversationId) => {
  try {
    const response = await fetch(`${API_URL}/conversations/${conversationId}/details`);
    if (!response.ok) {
      throw new Error("Failed to fetch conversation details");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching conversation details: ${error.message}`);
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

export const downloadEverything = async (platform, botId, scammerUniqueId) => {
  try {
    const response = await fetch(`${HOST_URL}/download/everything`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ platform, botId, scammerUniqueId }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error downloading everything: ${error.message}`);
  }
};

export const sendBot = async (
  botId,
  scammerIds,
  platform,
  typeOfScam,
  startingMessage
) => {
  try {
    const response = await fetch(`${API_URL}/send_bot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        botId,
        scammerIds,
        platform,
        typeOfScam,
        startingMessage,
      }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error starting bot: ${error.message}`);
  }
};

export const sendProactiveMessage = async (
  botId,
  scammerId,
  platform,
  message
) => {
  try {
    const response = await fetch(`${API_URL}/send_proactive_message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ botId, scammerId, platform, message }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error sending proactive message: ${error.message}`);
  }
};

export const insertVictimProperty = async (bot_id, key, value) => {
  try {
    const response = await fetch(`${API_URL}/victim_details/${bot_id}/property`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key, value }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error inserting property: ${error.message}`);
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

export const markAlertAsRead = async (alertId) => {
  try {
    const response = await fetch(`${API_URL}/alerts/${alertId}/mark_read`, {
      method: "PUT",
    });
    if (!response.ok) {
      throw new Error("Failed to mark alert as read");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error marking alert as read: ${error.message}`);
  }
};

export const markAllAlertsAsRead = async () => {
  try {
    const response = await fetch(`${API_URL}/alerts/mark_all_read`, {
      method: "PUT",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error marking all alerts as read: ${error.message}`);
  }
};

export const markAlertAsUnread = async (alertId) => {
  try {
    const response = await fetch(`${API_URL}/alerts/${alertId}/mark_unread`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error marking alert as unread: ${error.message}`);
  }
};

export const restoreAlert = async (alertId) => {
  try {
    const response = await fetch(`${API_URL}/alerts/${alertId}/restore`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to restore alert");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error restoring alert: ${error.message}`);
  }
};

export const llmIgnorePreviousMessages = async (
  platform,
  botId,
  scammerUniqueId
) => {
  try {
    const response = await fetch(`${API_URL}/llm_ignore_message_history`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ platform, botId, scammerUniqueId }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error ignoring previous messages: ${error.message}`);
  }
};

export const toggleBotPause = async (botId) => {
  try {
    const response = await fetch(`${API_URL}/bots/${botId}/toggle_pause`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error pausing/resuming bot: ${error.message}`);
  }
};

export const toggleBotPauseSelectively = async (botId) => {
  try {
    const response = await fetch(`${API_URL}/bots/${botId}/toggle_pause_selectively`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error pausing/resuming bot: ${error.message}`);
  }
};

export const toggleConversationPause = async (platform, botId, scammerUniqueId) => {
  try {
    const response = await fetch(
      `${API_URL}/conversations/toggle_pause`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform: platform,
          bot_id: botId,
          scammer_unique_id: scammerUniqueId,
        }),
      }
    );
    console.log(response)
    if (!response.ok) {
      throw new Error("Failed to toggle conversation pause status");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error toggling pause status: ${error.message}`);
  }
};

export const updateVictimProperty = async (botId, key, value) => {
  try {
    const response = await fetch(`${API_URL}/victim_details/${botId}/property/${encodeURIComponent(key)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error updating property: ${error.message}`);
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

export const deleteAlert = async (alertId) => {
  try {
    const response = await fetch(`${API_URL}/alerts/${alertId}/delete`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete alert");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error deleting alert: ${error.message}`);
  }
};

export const deleteVictimProperty = async (botId, key) => {
  try {
    const response = await fetch(`${API_URL}/victim_details/${botId}/property/${encodeURIComponent(key)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error deleting property: ${error.message}`);
  }
};