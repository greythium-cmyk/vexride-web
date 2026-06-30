-- Vexride Supabase Schema
-- Run in Supabase SQL Editor after enabling Clerk native integration.
-- Docs: https://clerk.com/docs/integrations/databases/supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (synced from Clerk via webhook or on first login)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_initials TEXT DEFAULT 'VR',
  plan TEXT DEFAULT 'Pro',
  rating NUMERIC(3,2) DEFAULT 4.8,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Active / upcoming trips
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  driver_name TEXT NOT NULL,
  driver_avatar TEXT NOT NULL,
  driver_rating NUMERIC(3,2) NOT NULL,
  driver_premium BOOLEAN DEFAULT FALSE,
  route_from TEXT NOT NULL,
  route_to TEXT NOT NULL,
  trip_date TEXT NOT NULL,
  trip_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  passengers INT DEFAULT 1,
  match_score INT DEFAULT 90,
  vehicle TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Match suggestions
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  driver_name TEXT NOT NULL,
  driver_avatar TEXT NOT NULL,
  driver_rating NUMERIC(3,2) NOT NULL,
  driver_premium BOOLEAN DEFAULT FALSE,
  route_from TEXT NOT NULL,
  route_to TEXT NOT NULL,
  match_time TEXT NOT NULL,
  match_score INT NOT NULL,
  savings TEXT NOT NULL,
  co2_saved TEXT NOT NULL,
  joined BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vex AI + companion chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  channel TEXT DEFAULT 'vex-ai',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Monthly stats
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  savings NUMERIC(10,2) DEFAULT 0,
  trips INT DEFAULT 0,
  co2_saved NUMERIC(10,2) DEFAULT 0,
  UNIQUE(user_id, month)
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  unread BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trips_user ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_user ON matches(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_user ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE trips;
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- RLS: Clerk JWT sub claim maps to clerk_id
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper: get profile id from Clerk JWT
CREATE OR REPLACE FUNCTION requesting_user_id()
RETURNS UUID AS $$
  SELECT id FROM profiles
  WHERE clerk_id = (auth.jwt() ->> 'sub')
  LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (clerk_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (clerk_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users insert own profile" ON profiles
  FOR INSERT WITH CHECK (clerk_id = (auth.jwt() ->> 'sub'));

-- Trips policies
CREATE POLICY "Users manage own trips" ON trips
  FOR ALL USING (user_id = requesting_user_id());

-- Matches policies
CREATE POLICY "Users manage own matches" ON matches
  FOR ALL USING (user_id = requesting_user_id());

-- Chat policies
CREATE POLICY "Users manage own chat" ON chat_messages
  FOR ALL USING (user_id = requesting_user_id());

-- Stats policies
CREATE POLICY "Users read own stats" ON user_stats
  FOR SELECT USING (user_id = requesting_user_id());

-- Notifications policies
CREATE POLICY "Users manage own notifications" ON notifications
  FOR ALL USING (user_id = requesting_user_id());
