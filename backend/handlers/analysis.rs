use crate::models::analysis::{Analysis, AnalysisRequest, AnalysisResponse};
use axum::{Json, extract::State};
use sqlx::{Pool, Postgres};
use uuid::Uuid;

pub async fn create_analysis(
    State(pool): State<Pool<Postgres>>,
    Json(request): Json<AnalysisRequest>,
) -> Result<Json<AnalysisResponse>, String> {
    let id = Uuid::now_v7();

    let analysis = sqlx::query_as::<_, Analysis>(
        "
        INSERT INTO analysis (
            id,
            listing_id,
            risk_score,
            risk_level,
            signals,
            price_analysis,
            network_summary,
            claude_raw,
            created_at
        )
        VALUES (
            $1,  $2,  $3,  $4,   $5,
            $6,  $7,  $8,  NOW()
        )
        RETURNING *
        ",
    )
    .bind(id)
    .bind(&request.listing_id)
    .bind(&request.risk_score)
    .bind(&request.risk_level)
    .bind(&request.signals)
    .bind(&request.price_analysis)
    .bind(Some(String::from("network summary")))
    .bind(Some(String::from("claude raw")))
    .fetch_one(&pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(Json(AnalysisResponse::from(analysis)))
}
