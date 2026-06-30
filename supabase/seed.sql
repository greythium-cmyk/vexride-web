-- Vexride seed data (run after schema.sql, replace USER_CLERK_ID and profile id)
-- Example: seed for demo user after first Clerk sign-up

-- INSERT INTO profiles (clerk_id, email, full_name, avatar_initials, plan, rating)
-- VALUES ('user_xxx', 'demo@vexride.com', 'Alex Rivera', 'AR', 'Pro', 4.8);

-- INSERT INTO trips (user_id, driver_name, driver_avatar, driver_rating, driver_premium, route_from, route_to, trip_date, trip_time, status, passengers, match_score, vehicle)
-- SELECT id, 'María G.', 'MG', 4.9, false, 'Brooklyn Heights', 'Midtown Manhattan', 'Mañana, 30 Jun', '8:15 AM', 'confirmed', 3, 97, 'Toyota Camry 2023'
-- FROM profiles WHERE clerk_id = 'user_xxx';

-- INSERT INTO matches (user_id, driver_name, driver_avatar, driver_rating, driver_premium, route_from, route_to, match_time, match_score, savings, co2_saved)
-- SELECT id, 'Sofia K.', 'SK', 4.92, true, 'Williamsburg', 'Wall Street', '8:25 AM', 98, '$18', '2.8 kg'
-- FROM profiles WHERE clerk_id = 'user_xxx';

-- INSERT INTO user_stats (user_id, month, savings, trips, co2_saved)
-- SELECT id, m.month, m.savings, m.trips, m.co2
-- FROM profiles, (VALUES
--   ('Ene', 120, 8, 3.2),
--   ('Feb', 145, 10, 4.1),
--   ('Mar', 168, 12, 4.8),
--   ('Abr', 190, 14, 5.5),
--   ('May', 215, 16, 6.2),
--   ('Jun', 247, 18, 7.1)
-- ) AS m(month, savings, trips, co2)
-- WHERE clerk_id = 'user_xxx';
