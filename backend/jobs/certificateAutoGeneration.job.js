import { pool } from "../config/db.js";
import { autoIssueCertificatesForStudent } from "../services/certificate.service.js";

const INTERVAL_MS = Math.max(
  Number(process.env.CERTIFICATE_AUTO_CHECK_INTERVAL_MS || 5 * 60 * 1000),
  60 * 1000,
);

let timer = null;
let running = false;

export const runCertificateAutoGeneration = async () => {
  if (running) return [];
  running = true;
  const issued = [];

  try {
    const result = await pool.query(
      `SELECT DISTINCT sdp.student_id
         FROM student_drive_progress sdp
         JOIN recruitment_drives d ON d.id = sdp.drive_id
        WHERE LOWER(d.status) = 'completed'
        ORDER BY sdp.student_id`,
    );

    for (const row of result.rows) {
      try {
        const newCertificates = await autoIssueCertificatesForStudent({
          studentProfileId: row.student_id,
          reason: "scheduled-eligibility-check",
        });
        issued.push(...newCertificates);
      } catch (error) {
        console.error(
          `[certificate] Scheduled auto-generation failed for student ${row.student_id}:`,
          error.message,
        );
      }
    }
  } finally {
    running = false;
  }

  return issued;
};

export const start = () => {
  if (timer) return timer;
  timer = setInterval(() => {
    runCertificateAutoGeneration().catch((error) => {
      console.error("[certificate] Auto-generation scheduler failed:", error);
    });
  }, INTERVAL_MS);
  timer.unref?.();
  runCertificateAutoGeneration().catch((error) => {
    console.error("[certificate] Initial auto-generation check failed:", error);
  });
  return timer;
};

export const stop = () => {
  if (timer) clearInterval(timer);
  timer = null;
};

export default { start, stop, runCertificateAutoGeneration };
