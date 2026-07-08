export const resolveStudentReference = (studentId, users = []) => {
  const normalizedReference = Number(studentId);

  if (!Number.isInteger(normalizedReference) || normalizedReference <= 0) {
    return null;
  }

  for (const user of users) {

    if (Number(user.id) === normalizedReference) {
      return Number(user.id);
    }

  }

  return null;
};



export const resolveStudentUserId = async (dbClient, studentId) => {

  const normalizedReference = Number(studentId);

  if (!Number.isInteger(normalizedReference) || normalizedReference <= 0) {
    return null;
  }


  const result = await dbClient.query(
    `
    SELECT id
    FROM users
    WHERE id = $1
    AND role = 'student'
    LIMIT 1
    `,
    [normalizedReference]
  );


  return resolveStudentReference(
    normalizedReference,
    result.rows
  );
};



export default {
  resolveStudentReference,
  resolveStudentUserId,
};