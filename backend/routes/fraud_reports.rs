use crate::handlers::fraud_reports::create_fraud_reports;
use axum::{Router, routing::post};
use sqlx::{Pool, Postgres};

pub fn fraud_reports_routes() -> Router<Pool<Postgres>> {
    Router::new().route("/fraud_reports", post(create_fraud_reports))
}
