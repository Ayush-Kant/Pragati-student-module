import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateCertificatePDF = async ({
  studentName,
  driveName,
  score,
  completionDate,
  mentorName,
  verifyUrl,
  verifyUuid,
}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        layout: "landscape",
        size: "A4",
      });

      const filename = `${verifyUuid}.pdf`;
      const publicDir = path.join(__dirname, "../public/certificates");
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      const filePath = path.join(publicDir, filename);
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Design/Styling for the Certificate
      // Border
      doc
        .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
        .stroke("#4A5568");
      doc
        .rect(25, 25, doc.page.width - 50, doc.page.height - 50)
        .stroke("#CBD5E0");

      // Title
      doc
        .fontSize(36)
        .font("Helvetica-Bold")
        .fillColor("#2B6CB0")
        .text("CERTIFICATE OF COMPLETION", {
          align: "center",
        });

      doc.moveDown(1.5);

      // Body text
      doc
        .fontSize(16)
        .font("Helvetica")
        .fillColor("#2D3748")
        .text("This is proudly presented to", {
          align: "center",
        });

      doc.moveDown(0.5);

      // Student Name
      doc
        .fontSize(24)
        .font("Helvetica-Bold")
        .fillColor("#1A202C")
        .text(studentName, {
          align: "center",
        });

      doc.moveDown(1);

      // Description
      doc
        .fontSize(14)
        .font("Helvetica")
        .fillColor("#4A5568")
        .text(`for successfully completing the recruitment drive`, {
          align: "center",
        });

      doc.moveDown(0.5);

      // Drive Name
      doc
        .fontSize(18)
        .font("Helvetica-Bold")
        .fillColor("#2D3748")
        .text(driveName, {
          align: "center",
        });

      doc.moveDown(1);

      // Score
      if (score !== undefined && score !== null) {
        doc
          .fontSize(14)
          .font("Helvetica")
          .fillColor("#4A5568")
          .text(`with an overall score of: ${score}%`, {
            align: "center",
          });
        doc.moveDown(1);
      }

      // Completion Date
      doc
        .fontSize(12)
        .font("Helvetica")
        .fillColor("#718096")
        .text(`Date of Completion: ${completionDate}`, {
          align: "center",
        });

      doc.moveDown(2);

      // Signatures row
      const y = doc.y;

      // Mentor Name
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .fillColor("#2D3748")
        .text(mentorName || "Mentor", 100, y, {
          width: 250,
          align: "center",
        });
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#718096")
        .text("Course Mentor", 100, y + 20, {
          width: 250,
          align: "center",
        });

      // Verification info
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .fillColor("#2D3748")
        .text("Pragati Portal", doc.page.width - 350, y, {
          width: 250,
          align: "center",
        });
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#718096")
        .text(`Verify URL: ${verifyUrl}`, doc.page.width - 350, y + 20, {
          width: 250,
          align: "center",
        });

      doc.end();

      writeStream.on("finish", () => {
        const url = `/public/certificates/${filename}`;
        resolve({
          url,
          filePath,
          filename,
        });
      });

      writeStream.on("error", (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};
