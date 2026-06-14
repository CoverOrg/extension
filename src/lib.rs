use wasm_bindgen::prelude::*;

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
