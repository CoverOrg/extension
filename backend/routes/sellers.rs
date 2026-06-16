use axum::{Router, routing::post};

pub fn seller_routes() -> Router<sqlx::Postgres> {
    Router::new().route("/sellers", post(create_seller))
}
