// state.js — window.__safelyData shape + helpers
(function () {
  "use strict";

  window.__safelyData = {
    riskScore: 0,
    seller: {
      name: "Unknown",
      handle: "",
      accountAge: "Unknown",
      verification: "unknown",
      totalDeals: 0,
      disputes: 0,
      completionRate: "N/A",
      location: "",
      lastActive: "Unknown",
      networkSummary: "Could not connect to Safely server.",
      platforms: [],
      monthlyActivity: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    signals: [],
  };

  window.__safelyUpdateState = function (newData) {
    window.__safelyData = Object.assign({}, window.__safelyData, newData);
  };

  window.__safelyResetState = function () {
    window.__safelyData = {
      riskScore: 0,
      seller: {
        name: "Unknown",
        handle: "",
        accountAge: "Unknown",
        verification: "unknown",
        totalDeals: 0,
        disputes: 0,
        completionRate: "N/A",
        location: "",
        lastActive: "Unknown",
        networkSummary: "Could not connect to Safely server.",
        platforms: [],
        monthlyActivity: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      signals: [],
    };
  };
})();
