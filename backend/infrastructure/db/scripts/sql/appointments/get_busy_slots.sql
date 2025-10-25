SELECT appointment_date, status 
FROM appointments 
WHERE DATE(appointment_date) = DATE(?)
AND status IN ('pending', 'confirmed')
ORDER BY appointment_date