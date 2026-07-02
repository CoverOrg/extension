ALTER TABLE analysis ADD COLUMN user_id UUID REFERENCES users(id);
ALTER TABLE fraud_reports ADD COLUMN user_id UUID REFERENCES users(id);

CREATE INDEX idx_analysis_user_id ON analysis (user_id);
CREATE INDEX idx_fraud_reports_user_id ON fraud_reports (user_id);
