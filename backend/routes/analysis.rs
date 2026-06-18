use crate::handlers::analysis::create_analysis;
use axum::{Router, routing::post};
use sqlx::{Pool, Postgres};

pub fn analysis_routes() -> Router<Pool<Postgres>> {
    Router::new().route("/analysis", post(create_analysis))
}
