CREATE TABLE IF NOT EXISTS broadcasts (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  scheduled_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS warranty_reminders (
  id SERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  battery_name TEXT NOT NULL,
  start_date BIGINT NOT NULL,
  duration_months INTEGER NOT NULL,
  notifications_paused_until BIGINT
);

CREATE TABLE IF NOT EXISTS users (
  user_id BIGINT PRIMARY KEY,
  username TEXT
);
