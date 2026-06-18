use crate::handlers::listings::create_listing;
use axum::{Router, routing::post};
use sqlx::{Pool, Postgres};

pub fn listing_routes() -> Router<Pool<Postgres>> {
    Router::new().route("/listings", post(create_listing))
}
