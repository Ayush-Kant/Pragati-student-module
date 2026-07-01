import { pool } from "./config/db.js";
import studentService from "./services/student.service.js";

const test = async () => {
    try {
        const payload = {
            enrollment_no: "2023TEST001",
            name: "Test User",
            email: "test@example.com",
            phone: "9876543210",
            department: "Computer Science",
            course: "B.Tech",
            semester: 5,
            cgpa: 8.5,
            placement_status: "Eligible",
            skills: [{ skill_name: "React" }]
        };
        const res = await studentService.addStudent(payload);
        console.log("Success:", res);
    } catch (e) {
        console.error("Error:", e.message);
    } finally {
        pool.end();
    }
}
test();
