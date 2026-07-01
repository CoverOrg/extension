// --- Sidebar Navigation ---
const sidebarItems = document.querySelectorAll(".sidebar-item");
const mainPanels = document.querySelectorAll(".tab-panel");
sidebarItems.forEach((item) => {
  item.addEventListener("click", () => {
    sidebarItems.forEach((i) => i.classList.remove("active"));
    mainPanels.forEach((p) => p.classList.remove("active"));
    item.classList.add("active");
    document
      .getElementById(`panel-${item.dataset.tab}`)
      .classList.add("active");
    document.querySelector(".dashboard-content").scrollTop = 0;
  });
});

// --- Risk Sub-Tab Switching ---
const riskSubTabs = document.querySelectorAll("#panel-risk .sub-tab");
const riskSubPanels = document.querySelectorAll("#panel-risk .sub-panel");
riskSubTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    riskSubTabs.forEach((t) => t.classList.remove("active"));
    riskSubPanels.forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.sub).classList.add("active");
  });
});

// --- Protect Tab Logic ---
const protectSubTabs = document.querySelectorAll(
  "#safely-protect-subs .safely-sub-tab",
);
const protectSubs = {
  orders: "safely-sub-orders",
  "new-order": "safely-sub-new-order",
  seller: "safely-sub-seller",
};
protectSubTabs.forEach((btn) => {
  btn.addEventListener("click", () => {
    protectSubTabs.forEach((b) => b.classList.remove("safely-active"));
    btn.classList.add("safely-active");
    Object.values(protectSubs).forEach(
      (id) => (document.getElementById(id).style.display = "none"),
    );
    document.getElementById(protectSubs[btn.dataset.sub]).style.display =
      "block";
    document.querySelector(".dashboard-content").scrollTop = 0;
  });
});

// --- New Order Steps ---
let formStep = 1;
const updateStepIndicator = (step) => {
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById(`safely-dot-${i}`);
    const stepEl = document.getElementById(`safely-step-${i}`);
    const stepLabel = dot.parentElement;
    dot.classList.remove("dot-active", "dot-done");
    stepLabel.classList.remove("step-active");
    if (i < step) {
      dot.classList.add("dot-done");
      dot.innerHTML =
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (i === step) {
      dot.classList.add("dot-active");
      dot.textContent = i;
      stepLabel.classList.add("step-active");
    } else {
      dot.textContent = i;
    }
    stepEl.classList.remove("sub-visible");
  }
  document.getElementById(`safely-step-${step}`).classList.add("sub-visible");
};
document.getElementById("safely-to-step2")?.addEventListener("click", () => {
  formStep = 2;
  updateStepIndicator(2);
  document.querySelector(".dashboard-content").scrollTop = 0;
});
document.getElementById("safely-back-step1")?.addEventListener("click", () => {
  formStep = 1;
  updateStepIndicator(1);
});
document.getElementById("safely-to-step3")?.addEventListener("click", () => {
  formStep = 3;
  updateStepIndicator(3);
  document.querySelector(".dashboard-content").scrollTop = 0;
});
document.querySelectorAll("#safely-step-row .new-step").forEach((el) => {
  el.addEventListener("click", () => {
    const s = parseInt(el.dataset.step);
    if (!isNaN(s) && s <= formStep) {
      formStep = s;
      updateStepIndicator(s);
    }
  });
});

// --- Seller Method Toggle ---
const pillHandle = document.getElementById("safely-pill-handle");
const pillWhatsapp = document.getElementById("safely-pill-whatsapp");
pillHandle?.addEventListener("click", () => {
  pillHandle.classList.add("pm-active");
  pillWhatsapp.classList.remove("pm-active");
  document
    .getElementById("safely-block-handle")
    .classList.remove("method-hidden");
  document
    .getElementById("safely-block-whatsapp")
    .classList.add("method-hidden");
});
pillWhatsapp?.addEventListener("click", () => {
  pillWhatsapp.classList.add("pm-active");
  pillHandle.classList.remove("pm-active");
  document
    .getElementById("safely-block-whatsapp")
    .classList.remove("method-hidden");
  document.getElementById("safely-block-handle").classList.add("method-hidden");
});

// --- Seller Steps ---
let sellerStep = 1;
const selViews = [
  "safely-sel-lookup",
  "safely-sel-order",
  "safely-sel-ship",
  "safely-sel-shipped",
];
const updateSellerStepIndicator = (step) => {
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById(`safely-sel-dot-${i}`);
    const stepLabel = dot.parentElement;
    dot.classList.remove("safely-sel-dot-active", "safely-sel-dot-done");
    stepLabel.classList.remove("safely-sel-active");
    if (i < step) {
      dot.classList.add("safely-sel-dot-done");
      dot.innerHTML =
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (i === step) {
      dot.classList.add("safely-sel-dot-active");
      dot.textContent = i;
      stepLabel.classList.add("safely-sel-active");
    } else {
      dot.textContent = i;
    }
  }
  selViews.forEach((id) =>
    document.getElementById(id).classList.remove("sub-visible"),
  );
  const viewIndex = step <= 3 ? step - 1 : 3;
  document.getElementById(selViews[viewIndex]).classList.add("sub-visible");
  document.querySelector(".dashboard-content").scrollTop = 0;
};
document
  .getElementById("safely-sel-lookup-btn")
  ?.addEventListener("click", () => {
    sellerStep = 2;
    updateSellerStepIndicator(2);
  });
document
  .getElementById("safely-sel-back-lookup")
  ?.addEventListener("click", () => {
    sellerStep = 1;
    updateSellerStepIndicator(1);
  });
document.getElementById("safely-sel-reject")?.addEventListener("click", () => {
  sellerStep = 1;
  updateSellerStepIndicator(1);
});
document.getElementById("safely-sel-accept")?.addEventListener("click", () => {
  sellerStep = 3;
  updateSellerStepIndicator(3);
});
document
  .getElementById("safely-sel-back-order")
  ?.addEventListener("click", () => {
    sellerStep = 2;
    updateSellerStepIndicator(2);
  });
document
  .getElementById("safely-sel-confirm-ship")
  ?.addEventListener("click", () => {
    sellerStep = 4;
    updateSellerStepIndicator(4);
  });
document
  .querySelectorAll("#safely-sel-step-row .safely-sel-step")
  .forEach((el) => {
    el.addEventListener("click", () => {
      const s = parseInt(el.dataset.sstep);
      if (!isNaN(s) && s <= sellerStep) {
        sellerStep = s;
        updateSellerStepIndicator(s);
      }
    });
  });

// --- User Popup Toggle ---
const userTrigger = document.getElementById("userTrigger");
const userPopup = document.getElementById("userPopup");
userTrigger.addEventListener("click", (e) => {
  e.stopPropagation();
  userPopup.classList.toggle("visible");
});
document.addEventListener("click", (e) => {
  if (
    !userPopup.contains(e.target) &&
    e.target !== userTrigger &&
    !userTrigger.contains(e.target)
  )
    userPopup.classList.remove("visible");
});
userPopup.addEventListener("click", (e) => e.stopPropagation());
document.getElementById("btnSettings")?.addEventListener("click", () => {
  alert("Navigating to Settings...");
  userPopup.classList.remove("visible");
});
document.getElementById("btnLogout")?.addEventListener("click", () => {
  alert("Logging out...");
  userPopup.classList.remove("visible");
});

// --- Report Submission ---
document.getElementById("submitReport")?.addEventListener("click", function () {
  if (!document.querySelector('input[name="report-reason"]:checked')) {
    alert("Please select a reason.");
    return;
  }
  this.textContent = "Submitting...";
  this.disabled = true;
  setTimeout(() => {
    this.style.display = "none";
    document.getElementById("reportSuccess").style.display = "flex";
  }, 1000);
});
