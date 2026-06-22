use sqlx::{Error, Pool, Postgres};
use uuid::Uuid;

pub async fn count_fraud_reports(pool: &Pool<Postgres>, seller_id: Uuid) -> Result<i64, Error> {
    let count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM fraud_reports WHERE seller_id = $1")
        .bind(seller_id)
        .fetch_one(pool)
        .await?;

    Ok(count.0)
}

pub fn build_network_summary(fraud_count: i64) -> String {
    match fraud_count {
        0 => "Clean record on Cover network. No fraud reports found.".to_string(),
        1 => "1 fraud report found on Cover network. Proceed with caution.".to_string(),
        _ => format!(
            "{} fraud reports found on Cover network. High risk seller.",
            fraud_count
        ),
    }
}
