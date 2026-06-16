use sqlx::{Pool, Postgres, postgres::PgPoolOptions};

pub async fn load_pool(env_key: &str) -> Pool<Postgres> {
    dotenvy::dotenv().expect("The .env file should be accessed");
    let database_url =
        std::env::var(env_key).expect("DATABASE_URL needs to be present in the .env file");

    let db_pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Database connection needs to be established");

    db_pool
}
