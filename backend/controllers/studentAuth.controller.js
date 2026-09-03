import {
  ensureStudentAuthSchema,
  registerStudent,
  loginStudentWithFirebase,
  refreshStudentSession,
  logoutStudent,
} from "../services/studentAuth.service.js";

const REFRESH_COOKIE = "pragati_student_refresh";

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/api/auth/student",
  maxAge: Number(process.env.STUDENT_REFRESH_TTL_DAYS || 7) * 24 * 60 * 60 * 1000,
});

const clearCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/api/auth/student",
});

const handleError = (res, error) => {
  const status = Number(error?.statusCode) || (error?.code === "auth/email-already-exists" ? 409 : 500);
  const message = status === 500 ? "Authentication service failed" : error.message;
  return res.status(status).json({ success: false, message });
};

export const register = async (req, res) => {
  try {
    await ensureStudentAuthSchema();
    const student = await registerStudent(req.body || {});
    return res.status(201).json({
      success: true,
      message: "Registration successful. Please complete onboarding.",
      studentId: student.studentId,
      onboardingStep: student.onboardingStep,
    });
  } catch (error) {
    console.error("[student-auth] register:", error);
    return handleError(res, error);
  }
};

export const login = async (req, res) => {
  try {
    await ensureStudentAuthSchema();
    const result = await loginStudentWithFirebase(req.body?.idToken);

    res.cookie(REFRESH_COOKIE, result.refreshToken, cookieOptions());

    return res.status(200).json({
      success: true,
      accessToken: result.accessToken,
      student: {
        id: result.student.studentId,
        userId: result.student.userId,
        fullName: result.student.name,
        email: result.student.email,
        onboardingStep: result.student.onboardingStep,
        profileComplete: result.student.profileCompleteness,
      },
    });
  } catch (error) {
    console.error("[student-auth] login:", error);
    return handleError(res, error);
  }
};

export const refresh = async (req, res) => {
  try {
    await ensureStudentAuthSchema();
    const result = await refreshStudentSession(req.cookies?.[REFRESH_COOKIE]);
    return res.status(200).json({
      success: true,
      accessToken: result.accessToken,
      student: {
        id: result.student.studentId,
        userId: result.student.userId,
        fullName: result.student.name,
        email: result.student.email,
        onboardingStep: result.student.onboardingStep,
        profileComplete: result.student.profileCompleteness,
      },
    });
  } catch (error) {
    console.error("[student-auth] refresh:", error);
    return handleError(res, error);
  }
};

export const logout = async (req, res) => {
  try {
    await ensureStudentAuthSchema();
    await logoutStudent(req.cookies?.[REFRESH_COOKIE]);
    res.clearCookie(REFRESH_COOKIE, clearCookieOptions());
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("[student-auth] logout:", error);
    return handleError(res, error);
  }
};

export default { register, login, refresh, logout };
