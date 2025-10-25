SELECT 
  id, client_name, client_email, appointment_date, 
  status, notes, created_at, updated_at
FROM appointments 
WHERE id = ?