chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log(
      "[Cover] Extension installed — Protecting payments everywhere.",
    );
    chrome.action.setBadgeText({ text: "" });
    chrome.action.setBadgeBackgroundColor({ color: "#000000" });
  }
});

// Listen for notification messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "NOTIFICATION") {
    // Show badge dot on extension icon
    chrome.action.setBadgeText({ text: "\u2022" });
    chrome.action.setBadgeBackgroundColor({ color: "#000000" });

    // Auto-clear badge after 10 seconds
    setTimeout(() => {
      chrome.action.setBadgeText({ text: "" });
    }, 10000);
  }

  if (message.type === "CLEAR_BADGE") {
    chrome.action.setBadgeText({ text: "" });
  }

  return true;
});
