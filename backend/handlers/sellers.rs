use axum::extract::State;
use sqlx::{Pool, Postgres, types::Json};

use crate::models::sellers::Sellers;

pub async fn create_seller(
    State(pool): State<Pool<Postgres>>,
    Json(request): Json<SellersRequest>,
) -> Result<Json<SellersResponse>, String> {
    let id = uuid::now_v7();

    let seller = sqlx::query_as::<_, Sellers>(
        "
        INSERT INTO sellers (
            id,
            platform,
            platform_id,
            name,
            phone,
            profile_url,
            join_date,
            total_deals,
            disputes,
            completion_rate,
            location,
            last_seen_at,
            created_at,
            updated_at
        )
        VALUES (
            $1,   $2,     $3,    $4,    $5,
            $6,   NOW(),  $7,    $8,    $9,
            $10,  NOW(),  NOW(), NOW()
        )
        RETURNING *
        ",
    )
    .bind(id)
    .bind(platform)
    .bind(platform_id)
    .bind(name)
    .bind(phone)
    .bind(profile_url)
    .bind(join_date)
    .bind(total_deals)
    .bind(disputes)
    .bind(completion_rate)
    .bind(location)
    .bind(last_seen_at)
    .bind(created_at)
    .bind(updated_at)
    .fetch_one(&pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(Json(SellerResponse(seller)))
}
