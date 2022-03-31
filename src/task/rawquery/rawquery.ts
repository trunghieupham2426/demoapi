export const reminderTask = `
SELECT  c.subject,c.id,
      DATE_FORMAT(c.startDate, '%Y-%m-%d') AS 'startDate',
      u.email
FROM registration r
LEFT JOIN class c ON r.classId = c.id
LEFT JOIN user u ON r.userId = u.id
WHERE DATEDIFF(c.startDate, CURDATE()) <= 1 AND r.status = 'accept'
`;
