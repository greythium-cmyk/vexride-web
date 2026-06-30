-- Realtime migration for existing Vexride Supabase projects
-- Run in SQL Editor if you already applied an earlier schema.sql

ALTER TABLE trips ADD COLUMN IF NOT EXISTS location_label TEXT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS driver_lat DOUBLE PRECISION;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS driver_lng DOUBLE PRECISION;

-- Enable chat_messages in Realtime (safe if already added)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Verify Realtime is enabled (Supabase Dashboard → Database → Publications → supabase_realtime)
-- Tables required: trips, matches, notifications, chat_messages
