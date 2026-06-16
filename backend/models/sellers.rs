use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Sellers {
    pub id: Uuid,
    pub platform: String,
    pub platform_id: String,
    pub name: Option<String>,
    pub phone: Option<String>,
    pub profile_url: Option<String>,
    pub join_date: Option<NaiveDate>,
    pub total_deals: u32,
    pub disputes: u32,
    pub completion_rate: Option<u64>,
    pub location: Option<String>,
    pub last_seen_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct SellersRequest {
    pub platform: String,
    pub platform_id: Option<String>,
    pub name: Option<String>,
    pub phone: Option<String>,
    pub profile_url: Option<String>,
    pub join_date: Option<String>, // raw text like "Member since 2021" — backend parses this
}

#[derive(Debug, Serialize)]
pub struct SellersResponse {
    pub name: String,
    pub handle: String,       // "@username" format
    pub account_age: String,  // human readable "3 years, 2 months"
    pub verification: String, // "verified", "flagged", "unknown"
    pub total_deals: i32,
    pub disputes: i32,
    pub completion_rate: String,
    pub location: Option<String>,
    pub last_active: Option<String>, // "2 hours ago" — already formatted
    pub network_summary: String,     // "Clean record on Cover network..."
    pub platforms: Vec<PlatformResponse>,
    pub monthly_activity: Vec<i32>, // 12 numbers for the bar chart
}

#[derive(Debug, Serialize)]
pub struct PlatformResponse {
    pub name: String,
    pub status: String,        // "Active · 3 yr", "Not found"
    pub platform_type: String, // "active", "none"
}
