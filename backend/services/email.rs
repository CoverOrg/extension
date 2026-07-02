use std::env;

pub async fn send_magic_link_email(to_email: &str, verify_url: &str) -> Result<(), String> {
    let api_key = env::var("RESEND_API_KEY").map_err(|_| "RESEND_API_KEY not set".to_string())?;

    // While your domain isn't verified in Resend yet, this "from" address
    // must stay as onboarding@resend.dev and can only deliver to the email
    // you signed up to Resend with. Once you verify your domain (the
    // start@safely.sh subdomain you set up), switch this to your own address.
    let from_address =
        env::var("RESEND_FROM_EMAIL").unwrap_or_else(|_| "onboarding@resend.dev".to_string());

    let client = reqwest::Client::new();

    let body = serde_json::json!({
        "from": format!("Safely <{}>", from_address),
        "to": [to_email],
        "subject": "Sign in to Safely",
        "html": format!(
            r#"<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
                <h2 style="margin-bottom:8px">Sign in to Safely</h2>
                <p style="color:#555;line-height:1.6">Click the button below to sign in. This link expires in 15 minutes and can only be used once.</p>
                <a href="{}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#161616;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Sign in to Safely</a>
                <p style="color:#999;font-size:13px;margin-top:24px">If you did not request this, you can safely ignore this email.</p>
            </div>"#,
            verify_url
        ),
    });

    let response = client
        .post("https://api.resend.com/emails")
        .bearer_auth(api_key)
        .json(&body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        let status = response.status();
        let text = response.text().await.unwrap_or_default();
        return Err(format!("Resend error ({}): {}", status, text));
    }

    Ok(())
}
