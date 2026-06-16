use sqlx::PgPool;

pub async fn run_grants(pool: &PgPool) {
    sqlx::query(
        r#"
            GRANT USAGE ON SCHEMA public TO cover;
        "#,
    )
    .execute(pool)
    .await
    .expect("grant usage should be executed");

    sqlx::query(
        r#"
            GRANT CREATE ON SCHEMA public TO cover;
        "#,
    )
    .execute(pool)
    .await
    .expect("grant should be executed");

    sqlx::query(
        r#"
            GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cover;
        "#,
    )
    .execute(pool)
    .await
    .expect("grant should be executed");

    sqlx::query(
        r#"
            ALTER DEFAULT PRIVILEGES IN SCHEMA public
            GRANT ALL ON TABLES TO cover;
        "#,
    )
    .execute(pool)
    .await
    .expect("grant should be executed");
}
