use serde::Deserialize;
use wasm_bindgen::prelude::*;

#[derive(Deserialize)]
pub struct Signal {
    #[serde(rename = "type")]
    pub signal_type: String,
}

#[wasm_bindgen]
pub fn risk_level(score: u8) -> String {
    if score <= 33 {
        "low".into()
    } else if score <= 66 {
        "caution".into()
    } else {
        "high".into()
    }
}

#[wasm_bindgen]
pub fn risk_label(level: &str) -> String {
    match level {
        "low" => "Low risk".into(),
        "caution" => "Caution".into(),
        _ => "High risk".into(),
    }
}

#[wasm_bindgen]
pub fn risk_desc(desc: &str) -> String {
    match desc {
        "low" => "Safe to proceed".into(),
        "caution" => "Review before proceeding".into(),
        _ => "High risk detected".into(),
    }
}

#[wasm_bindgen]
pub fn build_activity_bars(activity: &[u8]) -> String {
    let max = *activity.iter().max().unwrap_or(&1) as f64;
    activity
        .iter()
        .map(|&v| {
            let pct = (v as f64 / max * 100.0).round();
            let height_px = (pct / 100.0 * 32.0).round() as u32;
            let opacity = 0.3 + (pct / 100.0) * 0.7;
            format!(
                r#"<div class="safely-activity-bar" style="height:{}px;opacity:{:.2}"></div>"#,
                height_px, opacity
            )
        })
        .collect::<Vec<_>>()
        .join("")
}

#[wasm_bindgen]
pub fn analyze_signals(signals_json: &str) -> String {
    let signals: Vec<Signal> = serde_json::from_str(signals_json).unwrap_or_default();

    let total = signals.len();
    let bad_count = signals
        .iter()
        .filter(|s| s.signal_type == "bad" || s.signal_type == "caution")
        .count();

    let level = if bad_count == 0 {
        "low"
    } else if bad_count == 1 {
        "caution"
    } else {
        "high"
    };

    let text = if bad_count == 0 {
        format!("All {} signals checked. No red flags detected.", total)
    } else {
        format!(
            "{} of {} signals need your attention — review before proceeding.",
            bad_count, total
        )
    };

    format!(r#"{{"level":"{}","text":"{}"}}"#, level, text)
}
