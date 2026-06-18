use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sqlx::prelude::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "risk_level_type", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum RiskLevel {
    Low,
    Caution,
    High,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Analysis {
    pub id: Uuid,
    pub listing_id: Uuid,
    pub risk_score: i16,
    pub risk_level: RiskLevel,
    pub signals: Value,
    pub price_analysis: Option<Value>,
    pub network_summary: Option<String>,
    pub claude_raw: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct AnalysisRequest {
    pub listing_id: Uuid,
    pub risk_score: i16,
    pub risk_level: RiskLevel,
    pub signals: Value,
    pub price_analysis: Option<Value>,
}

#[derive(Debug, Serialize)]
pub struct AnalysisResponse {
    pub id: Uuid,
    pub risk_score: i16,
    pub risk_level: RiskLevel,
    pub signals: Value,
    pub price_analysis: Option<Value>,
    pub network_summary: Option<String>,
    pub created_at: DateTime<Utc>,
}

impl From<Analysis> for AnalysisResponse {
    fn from(a: Analysis) -> Self {
        Self {
            id: a.id,
            risk_score: a.risk_score,
            risk_level: a.risk_level,
            signals: a.signals,
            price_analysis: a.price_analysis,
            network_summary: a.network_summary,
            created_at: a.created_at,
        }
    }
}
