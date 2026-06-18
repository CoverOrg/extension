use crate::models::fraud_reports::{FraudReports, FraudReportsRequest, FraudReportsResponse};
use axum::{Json, extract::State};
use sqlx::{Pool, Postgres};
use uuid::Uuid;

pub async fn create_fraud_reports(
    State(pool): State<Pool<Postgres>>,
    Json(request): Json<FraudReportsRequest>,
) -> Result<Json<FraudReportsResponse>, String> {
    let id = Uuid::now_v7();

    let fraud_reports = sqlx::query_as::<_, FraudReports>(
        "
        INSERT INTO fraud_reports (
            id,
            seller_id,
            platform,
            platform_id,
            report_type,
            description,
            reported_at
        )
        VALUES (
            $1,  $2,  $3,  $4,   $5,
            $6,  NOW()
        )
        RETURNING *
        ",
    )
    .bind(id)
    .bind(&request.seller_id)
    .bind(&request.platform)
    .bind(&request.platform_id)
    .bind(&request.report_type)
    .bind(&request.description)
    .fetch_one(&pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(Json(FraudReportsResponse::from(fraud_reports)))
}
