(function () {
  "use strict";

  if (document.getElementById("safely-root")) return;

  var panelVisible = false;
  var toolbarExpanded = false;
  var currentTab = "";
  var collapseTimer;
  var waitForClick = false;

  var tabIds = [];
  var tabTitles = {};

  // Shared Data
  window.__safelyData = {
    riskScore: 22,
    seller: {
      name: "Ali Khan",
      handle: "@alikhan_93",
      accountAge: "3 years, 2 months",
      verification: "verified",
      totalDeals: 142,
      disputes: 0,
      completionRate: "96%",
      location: "Lahore, PK",
      lastActive: "2 hours ago",
      networkSummary: "Clean record on Safely network. No fraud reports found.",
      platforms: [
        { name: "Facebook", status: "Active · 3 yr", type: "active" },
        { name: "OLX", status: "Active · 1 yr", type: "active" },
        { name: "Instagram", status: "Not found", type: "none" },
        { name: "Safely network", status: "142 deals", type: "active" },
      ],
      monthlyActivity: [4, 6, 8, 9, 7, 11, 10, 5, 9, 8, 12, 3],
    },
    signals: [
      {
        label: "Price analysis",
        sub: "Rs. 85,000 vs market avg Rs. 88,000",
        value: "Normal range",
        type: "good",
      },
      {
        label: "Urgency language",
        sub: "Scanned listing text and captions",
        value: "None found",
        type: "good",
      },
      {
        label: "Advance payment request",
        sub: "Checked listing and comments",
        value: "Not detected",
        type: "neutral",
      },
      {
        label: "Account age",
        sub: "Cross-referenced with Safely records",
        value: "3 yr 2 mo",
        type: "info",
      },
      {
        label: "Duplicate listing",
        sub: "Checked across OLX and Facebook",
        value: "No duplicates",
        type: "good",
      },
      {
        label: "Image authenticity",
        sub: "AI-generated and stock photo check",
        value: "Original",
        type: "good",
      },
      {
        label: "Fraud pattern match",
        sub: "Checked against Safely scam database",
        value: "No match",
        type: "good",
      },
      {
        label: "Contact info in listing",
        sub: "Phone number detected in listing text",
        value: "Detected",
        type: "caution",
      },
    ],
  };

  var pageData = window.__safelyData;

  // Helper Functions
  function riskLevel(s) {
    if (s <= 33) return "low";
    if (s <= 66) return "caution";
    return "high";
  }
  function riskLabel(l) {
    if (l === "low") return "Low risk";
    if (l === "caution") return "Caution";
    return "High risk";
  }
  function riskDesc(l) {
    if (l === "low") return "Safe to proceed";
    if (l === "caution") return "Review before proceeding";
    return "High risk detected";
  }

  function statusIcon(l) {
    if (l === "low")
      return '<svg viewBox="0 0 24 24" fill="none" stroke="#1d9bf0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    if (l === "caution")
      return '<svg viewBox="0 0 24 24" fill="none" stroke="#ff9f0a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="#ff453a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
  }

  function vBadge(s) {
    var d, c, t;
    if (s === "verified") {
      d = "safely-dot-green";
      c = "safely-badge-verified";
      t = "Safely Verified";
    } else if (s === "flagged") {
      d = "safely-dot-red";
      c = "safely-badge-flagged";
      t = "Flagged in Safely Network";
    } else {
      d = "safely-dot-gray";
      c = "safely-badge-unknown";
      t = "Unknown";
    }
    return (
      '<span class="safely-verified-badge ' +
      c +
      '"><span class="safely-badge-dot ' +
      d +
      '"></span>' +
      t +
      "</span>"
    );
  }

  var lvl = riskLevel(pageData.riskScore);
  var activityMax = Math.max.apply(null, pageData.seller.monthlyActivity);
  var activityBars = pageData.seller.monthlyActivity
    .map(function (v) {
      var pct = Math.round((v / activityMax) * 100);
      var heightPx = Math.round((pct / 100) * 32);
      return (
        '<div class="safely-activity-bar" style="height:' +
        heightPx +
        "px;opacity:" +
        (0.3 + (pct / 100) * 0.7).toFixed(2) +
        '"></div>'
      );
    })
    .join("");

  var platformRows = pageData.seller.platforms
    .map(function (p) {
      return (
        '<div class="safely-platform-row"><span class="safely-platform-name">' +
        p.name +
        '</span><span class="safely-platform-status safely-pstatus-' +
        p.type +
        '">' +
        p.status +
        "</span></div>"
      );
    })
    .join("");

  // Build Risk HTML
  var riskTabHTML =
    '<div class="safely-risk-row"><div>' +
    '<div class="safely-risk-number safely-risk-' +
    lvl +
    '">' +
    pageData.riskScore +
    "</div>" +
    '<div class="safely-risk-label safely-risk-' +
    lvl +
    '">' +
    riskLabel(lvl) +
    "</div>" +
    '<div class="safely-risk-desc">' +
    riskDesc(lvl) +
    "</div>" +
    '</div><div class="safely-status-circle safely-circle-' +
    lvl +
    '">' +
    statusIcon(lvl) +
    "</div></div>" +
    '<div class="safely-bar-track"><div class="safely-bar-fill safely-bar-' +
    lvl +
    '" style="width:' +
    pageData.riskScore +
    '%"></div></div>' +
    '<div class="safely-chips-row">' +
    '<div class="safely-chip"><div class="safely-chip-num">' +
    pageData.seller.totalDeals +
    '</div><div class="safely-chip-lbl">Total Deals</div></div>' +
    '<div class="safely-chip"><div class="safely-chip-num">' +
    pageData.seller.disputes +
    '</div><div class="safely-chip-lbl">Disputes</div></div>' +
    '<div class="safely-chip"><div class="safely-chip-num">' +
    pageData.seller.completionRate +
    '</div><div class="safely-chip-lbl">Completion Rate</div></div>' +
    "</div>" +
    '<div class="safely-section-label">Seller Information</div>' +
    '<div class="safely-seller-card">' +
    '<div class="safely-seller-name">' +
    pageData.seller.name +
    "</div>" +
    '<div class="safely-seller-handle">' +
    pageData.seller.handle +
    "</div>" +
    '<div class="safely-seller-detail"><span>Account age</span><span>' +
    pageData.seller.accountAge +
    "</span></div>" +
    '<div class="safely-seller-detail"><span>Location</span><span>' +
    pageData.seller.location +
    "</span></div>" +
    '<div class="safely-seller-detail"><span>Last active</span><span>' +
    pageData.seller.lastActive +
    "</span></div>" +
    '<div class="safely-seller-detail"><span>Verification</span>' +
    vBadge(pageData.seller.verification) +
    "</div>" +
    "</div>" +
    '<div class="safely-section-label" style="margin-top:18px">Platform presence</div>' +
    '<div class="safely-platform-card">' +
    platformRows +
    "</div>" +
    '<div class="safely-section-label" style="margin-top:18px">Deal activity \u2014 12 months</div>' +
    '<div class="safely-activity-card">' +
    '<div style="display:flex;align-items:flex-end;gap:3px;height:32px">' +
    activityBars +
    "</div>" +
    '<div style="display:flex;justify-content:space-between;margin-top:5px">' +
    '<span style="font-size:10px;color:#636366">Jul</span>' +
    '<span style="font-size:10px;color:#636366">Jun</span>' +
    "</div></div>" +
    '<div class="safely-network-alert safely-alert-' +
    lvl +
    '" style="margin-top:14px">' +
    "<span>&#9679;</span><span>" +
    pageData.seller.networkSummary +
    "</span></div>";

  // Base DOM Structure
  var root = document.createElement("div");
  root.id = "safely-root";
  root.innerHTML =
    '<div id="safely-panel">' +
    '<div class="safely-panel-header">' +
    '<span class="safely-panel-title" id="safely-panel-title">Safely</span>' +
    '<div class="safely-close-btn" id="safely-close-btn">\u00d7</div>' +
    "</div>" +
    '<div class="safely-tabs-area" id="safely-tabs-area"></div>' +
    "</div>" +
    '<div id="safely-toolbar"><span class="safely-toolbar-letter">S</span><div class="safely-toolbar-inner" id="safely-toolbar-inner">' +
    '<span class="safely-toolbar-label" id="safely-collapse-btn">Safely</span>' +
    "</div></div>";

  document.body.appendChild(root);
  window.__safelyRoot = root;

  var panel = document.getElementById("safely-panel");
  var toolbar = document.getElementById("safely-toolbar");
  var collapseBtn = document.getElementById("safely-collapse-btn");
  var panelTitle = document.getElementById("safely-panel-title");
  var closeBtn = document.getElementById("safely-close-btn");
  var tabsArea = document.getElementById("safely-tabs-area");
  var toolbarInner = document.getElementById("safely-toolbar-inner");

  function switchTab(tab) {
    currentTab = tab;
    panelTitle.textContent = tabTitles[tab] || tab;
    tabIds.forEach(function (id) {
      var el = document.getElementById("safely-tab-" + id);
      if (el) el.style.display = id === tab ? "block" : "none";
    });
    if (tabsArea) tabsArea.scrollTop = 0;
  }

  function togglePanel(tab) {
    if (panelVisible && currentTab === tab) {
      panelVisible = false;
      panel.classList.remove("safely-visible");
    } else {
      switchTab(tab);
      panelVisible = true;
      panel.classList.add("safely-visible");
    }
  }

  function closePanel() {
    panelVisible = false;
    panel.classList.remove("safely-visible");
  }

  function collapseToolbar() {
    toolbarExpanded = false;
    panelVisible = false;
    toolbar.classList.remove("safely-toolbar-expanded");
    panel.classList.remove("safely-visible");
  }

  // Global function for other files to register tabs
  window.__safelyAddTab = function (id, title, html, iconSvg, initFn) {
    tabIds.push(id);
    tabTitles[id] = title;

    var tabDiv = document.createElement("div");
    tabDiv.className = "safely-tab-content";
    tabDiv.id = "safely-tab-" + id;
    tabDiv.style.display = "none";
    tabDiv.innerHTML = html;
    tabsArea.appendChild(tabDiv);

    var iconDiv = document.createElement("div");
    iconDiv.className = "safely-toolbar-icon";
    iconDiv.dataset.open = id;
    iconDiv.title = title;
    iconDiv.innerHTML = iconSvg;
    toolbarInner.insertBefore(iconDiv, collapseBtn);

    iconDiv.addEventListener("click", function (e) {
      e.stopPropagation();
      togglePanel(id);
    });

    if (tabIds.length === 1) switchTab(id);
    if (typeof initFn === "function") initFn(root);
  };

  // Toolbar Events
  toolbar.addEventListener("mouseenter", function () {
    clearTimeout(collapseTimer);
    if (waitForClick) return;
    toolbarExpanded = true;
    toolbar.classList.add("safely-toolbar-expanded");
  });
  toolbar.addEventListener("mouseleave", function (e) {
    waitForClick = false;
    if (e.relatedTarget && panel.contains(e.relatedTarget)) return;
    collapseTimer = setTimeout(collapseToolbar, 200);
  });
  panel.addEventListener("mouseenter", function () {
    clearTimeout(collapseTimer);
  });
  panel.addEventListener("mouseleave", function (e) {
    if (e.relatedTarget && toolbar.contains(e.relatedTarget)) return;
    collapseTimer = setTimeout(collapseToolbar, 200);
  });
  toolbar.addEventListener("click", function (e) {
    e.stopPropagation();
    if (e.target.closest(".safely-toolbar-inner")) return;
    if (waitForClick) {
      waitForClick = false;
      toolbarExpanded = true;
      toolbar.classList.add("safely-toolbar-expanded");
    }
  });
  collapseBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    collapseToolbar();
    waitForClick = true;
  });
  closeBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    closePanel();
  });
  document.addEventListener("click", function (e) {
    if (!root.contains(e.target)) {
      if (panelVisible) {
        panelVisible = false;
        panel.classList.remove("safely-visible");
      }
      if (toolbarExpanded) {
        toolbarExpanded = false;
        toolbar.classList.remove("safely-toolbar-expanded");
      }
    }
  });

  // Input Bubbling Prevention
  window.__safelyPreventInputBubbling = function () {
    root.querySelectorAll("input, textarea, select").forEach(function (el) {
      ["keydown", "keyup", "keypress"].forEach(function (evt) {
        el.removeEventListener(
          evt,
          function (e) {
            e.stopImmediatePropagation();
          },
          true,
        );
        el.addEventListener(
          evt,
          function (e) {
            e.stopImmediatePropagation();
          },
          true,
        );
      });
    });
  };

  // Register Risk Tab
  window.__safelyAddTab(
    "risk",
    "Risk & Seller",
    riskTabHTML,
    '<svg viewBox="0 0 24 24" fill="none" stroke="#8e8e93" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="9 12 11 14 15 10"/></svg>',
    function () {
      window.__safelyPreventInputBubbling();
    },
  );
})();
