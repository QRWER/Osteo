CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);