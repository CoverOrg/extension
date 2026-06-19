use crate::handlers::sellers::analyze;
use axum::{Router, routing::post};
use sqlx::{Pool, Postgres};

pub fn analyze_sellers() -> Router<Pool<Postgres>> {
    Router::new().route("/api/v1/analyze", post(analyze))
}
