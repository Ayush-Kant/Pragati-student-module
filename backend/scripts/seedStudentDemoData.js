import "dotenv/config";
import { pool } from "../config/db.js";

const DEMO_EMAIL = "student@demo.edu";
const WATCH_URL = "https://www.youtube.com/watch?v=Ke90Tje7VS0";
const EMBED_URL = "https://www.youtube.com/embed/Ke90Tje7VS0";
const WEEKLY_SESSION_HOURS = 24;

const safe = async (label, fn) => {
  try { return await fn(); }
  catch (error) { console.warn(`⚠️ ${label}: ${error.message}`); return null; }
};

const tableExists = async (tableName) => {
  const result = await pool.query(`SELECT to_regclass($1) AS table_name`, [`public.${tableName}`]);
  return Boolean(result.rows[0]?.table_name);
};

const columnExists = async (tableName, columnName) => {
  const result = await pool.query(
    `SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2 LIMIT 1`,
    [tableName, columnName],
  );
  return result.rowCount > 0;
};

const seed = async () => {
  const { rows: students } = await pool.query(
    `SELECT id, user_id AS "userId", name, email FROM students
      ORDER BY CASE WHEN LOWER(email) = $1 THEN 0 ELSE 1 END, id LIMIT 20`,
    [DEMO_EMAIL],
  );
  if (!students.length) throw new Error("No students found. Register a student first, then run this seed script.");

  const demoStudent = students.find((s) => String(s.email).toLowerCase() === DEMO_EMAIL) || students[0];
  const demoStudentId = Number(demoStudent.id);
  const demoUserId = Number(demoStudent.userId) || null;
  console.log(`🎯 Primary demo student: ${demoStudent.name} (${demoStudent.email}) [student_id=${demoStudentId}]`);

  // SM-01 / SM-02 -------------------------------------------------------------
  await safe("student profile", async () => {
    if (!(await tableExists("student_profiles"))) return;
    await pool.query(
      `INSERT INTO student_profiles
        (student_id, bio, gender, date_of_birth, address_line1, city, state, country,
         pincode, alternate_phone, alternate_email, profile_completeness)
       VALUES ($1,$2,$3,$4::date,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (student_id) DO UPDATE SET
         bio=EXCLUDED.bio, gender=EXCLUDED.gender, date_of_birth=EXCLUDED.date_of_birth,
         address_line1=EXCLUDED.address_line1, city=EXCLUDED.city, state=EXCLUDED.state,
         country=EXCLUDED.country, pincode=EXCLUDED.pincode, alternate_phone=EXCLUDED.alternate_phone,
         alternate_email=EXCLUDED.alternate_email, profile_completeness=EXCLUDED.profile_completeness,
         updated_at=NOW()`,
      [demoStudentId,"Full-stack developer in training. Building production-ready React, Node.js and PostgreSQL applications.","Prefer not to say","2003-06-15","42 Student Avenue","Hyderabad","Telangana","India","500032","+91-9000000001","student.alt@demo.edu",96],
    );
  });

  await safe("student academic details", async () => {
    if (!(await tableExists("student_academic_details"))) return;
    const candidateColumns = ["institution_name","department","course","degree","semester","graduation_year","cgpa","enrollment_number","admission_year","academic_email"];
    const present = [];
    for (const column of candidateColumns) if (await columnExists("student_academic_details", column)) present.push(column);
    if (!present.length || !(await columnExists("student_academic_details", "student_id"))) return;
    const values = {institution_name:"Pragati Institute of Technology",department:"Computer Science & Engineering",course:"B.Tech Computer Science",degree:"B.Tech",semester:7,graduation_year:2027,cgpa:8.7,enrollment_number:"PRG-DEMO-2023-001",admission_year:2023,academic_email:"ayush.student@college.demo"};
    const names=["student_id",...present];
    const args=names.map((n)=>n==="student_id"?demoStudentId:values[n]);
    await pool.query(
      `INSERT INTO student_academic_details (${names.join(",")}) VALUES (${names.map((_,i)=>`$${i+1}`).join(",")})
       ON CONFLICT (student_id) DO UPDATE SET ${present.map((n)=>`${n}=EXCLUDED.${n}`).join(",")}`,
      args,
    );
  });

  await safe("student skills/social/resume/certifications", async () => {
    if (await tableExists("student_skills") && await columnExists("student_skills","skill_name")) {
      for (const [name,level,category] of [["React","Advanced","Frontend"],["Node.js","Intermediate","Backend"],["PostgreSQL","Intermediate","Database"],["Python","Intermediate","Programming"],["Java","Beginner","Programming"],["Communication","Advanced","Professional"]]) {
        await pool.query(`INSERT INTO student_skills (student_id,skill_name,skill_level,category) VALUES ($1,$2,$3,$4)`,[demoStudentId,name,level,category]).catch(()=>undefined);
      }
    }
    if (await tableExists("student_social_links")) {
      await pool.query(
        `INSERT INTO student_social_links (student_id,linkedin_url,github_url,portfolio_url,twitter_url,website_url)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (student_id) DO UPDATE SET linkedin_url=EXCLUDED.linkedin_url,github_url=EXCLUDED.github_url,
           portfolio_url=EXCLUDED.portfolio_url,twitter_url=EXCLUDED.twitter_url,website_url=EXCLUDED.website_url,updated_at=NOW()`,
        [demoStudentId,"https://www.linkedin.com/in/pragati-demo-student","https://github.com/pragati-demo-student","https://portfolio.demo.student.example","https://x.com/pragati_demo_student","https://student.demo.example"],
      );
    }
    if (await tableExists("student_resumes")) {
      await pool.query(
        `INSERT INTO student_resumes (student_id,resume_url,file_name,file_size,mime_type)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (student_id) DO UPDATE SET resume_url=EXCLUDED.resume_url,file_name=EXCLUDED.file_name,file_size=EXCLUDED.file_size,mime_type=EXCLUDED.mime_type,updated_at=NOW()`,
        [demoStudentId,"https://example.com/demo-resume.pdf","student-demo-resume.pdf",184320,"application/pdf"],
      );
    }
    if (await tableExists("student_certifications")) {
      await pool.query(
        `INSERT INTO student_certifications (student_id,name,issuing_organization,issue_date,expiry_date,credential_id,credential_url)
         SELECT $1,$2,$3,$4::date,$5::date,$6::varchar,$7
         WHERE NOT EXISTS (SELECT 1 FROM student_certifications WHERE student_id=$1 AND credential_id=$6::varchar)`,
        [demoStudentId,"AWS Cloud Practitioner","Amazon Web Services","2025-10-15","2028-10-15","AWS-DEMO-001","https://example.com/cert/AWS-DEMO-001"],
      );
      await pool.query(
        `INSERT INTO student_certifications (student_id,name,issuing_organization,issue_date,credential_id,credential_url)
         SELECT $1,$2,$3,$4::date,$5::varchar,$6
         WHERE NOT EXISTS (SELECT 1 FROM student_certifications WHERE student_id=$1 AND credential_id=$5::varchar)`,
        [demoStudentId,"PostgreSQL Fundamentals","Pragati Academy","2026-01-20","PG-DEMO-002","https://example.com/cert/PG-DEMO-002"],
      );
    }
  });

  await safe("onboarding state", async () => {
    if (await columnExists("students","onboarding_step")) await pool.query(`UPDATE students SET onboarding_step=4 WHERE id=$1`,[demoStudentId]);
    if (demoUserId && await columnExists("users","last_active_at")) await pool.query(`UPDATE users SET last_active_at=NOW() WHERE id=$1`,[demoUserId]);
  });

  // SM-04 --------------------------------------------------------------------
  await safe("learning content", async () => {
    if (!(await tableExists("training_courses"))) return;
    const first=(await pool.query(`SELECT id FROM training_courses WHERE title='MERN Stack Foundations' LIMIT 1`)).rows[0]?.id;
    if (!first || !(await tableExists("course_modules")) || !(await tableExists("lessons"))) return;
    const lessons=await pool.query(`SELECT l.id,l.title,l.duration FROM lessons l JOIN course_modules m ON m.id=l.module_id WHERE m.course_id=$1 ORDER BY m.module_order,l.lesson_order`,[first]);
    if (await tableExists("learning_resources")) {
      for (const l of lessons.rows) for (const [title,type,url] of [["Reference article","article","https://react.dev/learn"],["Checklist PDF","pdf","https://example.com/resources/checklist.pdf"],["Cheat sheet","document","https://example.com/resources/cheatsheet.docx"],["Supplementary video","video",WATCH_URL]]) {
        await pool.query(`INSERT INTO learning_resources (lesson_id,title,resource_type,file_url,mime_type,file_size_bytes,storage_key)
          SELECT $1,$2,$3,$4,$5,$6,$7 WHERE NOT EXISTS (SELECT 1 FROM learning_resources WHERE lesson_id=$1 AND title=$2)`,[l.id,title,type,url,type==="pdf"?"application/pdf":"text/html",40960,`demo/${l.id}/${title.replace(/[^a-z0-9]+/gi,"-").toLowerCase()}`]).catch(()=>undefined);
      }
    }
    if (await tableExists("student_course_progress")) {
      const total=lessons.rowCount;
      await pool.query(`INSERT INTO student_course_progress (student_id,course_id,completed_lessons,total_lessons,progress) VALUES ($1,$2,$3,$4,$5)
        ON CONFLICT (student_id,course_id) DO UPDATE SET completed_lessons=EXCLUDED.completed_lessons,total_lessons=EXCLUDED.total_lessons,progress=EXCLUDED.progress,updated_at=NOW()`,[demoStudentId,first,Math.max(0,total-2),total,total?Math.round((total-2)/total*100):0]);
    }
    if (await tableExists("lesson_progress")) for (const [i,l] of lessons.rows.entries()) {
      const pct=i<lessons.rowCount-2?100:i===lessons.rowCount-2?62:8; const totalSeconds=1200; const watched=Math.floor(totalSeconds*pct/100);
      await pool.query(`INSERT INTO lesson_progress (student_id,lesson_id,completed,completed_at,watched_seconds,total_seconds,progress_pct,last_viewed_at)
        VALUES ($1,$2,$3,CASE WHEN $3 THEN NOW() ELSE NULL END,$4,$5,$6,NOW())
        ON CONFLICT (student_id,lesson_id) DO UPDATE SET completed=EXCLUDED.completed,completed_at=EXCLUDED.completed_at,watched_seconds=EXCLUDED.watched_seconds,total_seconds=EXCLUDED.total_seconds,progress_pct=EXCLUDED.progress_pct,last_viewed_at=NOW(),updated_at=NOW()`,[demoStudentId,l.id,pct>=80,watched,totalSeconds,pct]);
    }
    if (await tableExists("student_notes") && lessons.rows[0]) for (const [idx,text] of [[0,"Remember to keep validation in the service layer and return predictable errors."],[1,"Compare effect dependencies with memoization trade-offs."]]) if (lessons.rows[idx]) await pool.query(`INSERT INTO student_notes (student_id,lesson_id,note_text,timestamp_seconds) SELECT $1,$2,$3,$4 WHERE NOT EXISTS (SELECT 1 FROM student_notes WHERE student_id=$1 AND lesson_id=$2 AND note_text=$3)`,[demoStudentId,lessons.rows[idx].id,text,idx?780:420]).catch(()=>undefined);
  });

  // SM-05 --------------------------------------------------------------------
  await safe("weekly live sessions", async () => {
    if (!(await tableExists("live_sessions"))) return;
    const old=(await pool.query(`SELECT id FROM live_sessions WHERE title LIKE 'SM-05 Weekly QA Session %' ORDER BY id`)).rows;
    for (const r of old) { await pool.query(`DELETE FROM session_schedules WHERE session_id=$1`,[r.id]).catch(()=>undefined); await pool.query(`DELETE FROM session_recordings WHERE session_id=$1`,[r.id]).catch(()=>undefined); await pool.query(`DELETE FROM session_participants WHERE session_id=$1`,[r.id]).catch(()=>undefined); await pool.query(`DELETE FROM session_attendance WHERE session_id=$1`,[r.id]).catch(()=>undefined); await pool.query(`DELETE FROM live_sessions WHERE id=$1`,[r.id]); }
    const types=["webinar","workshop","mentor_qna","guest_lecture","mock_interview","career_talk","project_review"];
    const trainers=["Pragati Demo Trainer","Asha Mentor","Rahul Mentor","Meera Mentor","Placement Panel","Industry Guest","Capstone Mentor"];
    for (let day=0;day<7;day++) {
      const d=new Date(Date.now()+day*86400000),date=d.toISOString().slice(0,10),time=d.toISOString().slice(11,16),title=`SM-05 Weekly QA Session ${day+1} - ${date}`;
      const row=(await pool.query(`INSERT INTO live_sessions (mentor_id,title,session_type,scheduled_at,trainer,date,time,duration,status,room_name,meeting_url)
        VALUES (NULL,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,[title,types[day],d.toISOString(),trainers[day],date,time,`${WEEKLY_SESSION_HOURS} hours`,day===0?"Live":"Upcoming",`pragati-weekly-${day+1}`,EMBED_URL])).rows[0];
      if (!row) continue;
      if (await tableExists("session_schedules")) await pool.query(`INSERT INTO session_schedules (session_id,title,trainer,date,time,duration,status) VALUES ($1,$2,$3,$4,$5,$6,$7)`,[row.id,title,trainers[day],date,time,`${WEEKLY_SESSION_HOURS} hours`,day===0?"Live":"Scheduled"]);
      if (await tableExists("session_recordings")) await pool.query(`INSERT INTO session_recordings (session_id,title,duration,recording_url) VALUES ($1,$2,$3,$4)`,[row.id,`${title} recording`,`42 minutes`,WATCH_URL]);
    }
    const historical=[{daysAgo:1,minutes:60,durationSeconds:2520,title:"SM-05 Attendance QA - Present at 70%",type:"webinar"},{daysAgo:2,minutes:90,durationSeconds:1200,title:"SM-05 Attendance QA - Absent below 60%",type:"workshop"}];
    for (const item of historical) {
      const d=new Date(Date.now()-item.daysAgo*86400000),date=d.toISOString().slice(0,10),time=d.toISOString().slice(11,16);
      let sid=(await pool.query(`SELECT id FROM live_sessions WHERE title=$1 LIMIT 1`,[item.title])).rows[0]?.id;
      if (!sid) sid=(await pool.query(`INSERT INTO live_sessions (mentor_id,title,session_type,scheduled_at,trainer,date,time,duration,status,room_name,meeting_url) VALUES (NULL,$1,$2,$3,'Attendance QA Mentor',$4,$5,$6,'Completed',$7,$8) RETURNING id`,[item.title,item.type,d.toISOString(),date,time,`${item.minutes} minutes`,`pragati-attendance-${item.daysAgo}`,EMBED_URL])).rows[0]?.id;
      if (!sid || !demoUserId) continue;
      const join=new Date(d.getTime()+120000),leave=new Date(join.getTime()+item.durationSeconds*1000),required=item.minutes*60*0.6,isPresent=item.durationSeconds>=required;
      if (await tableExists("session_participants")) await pool.query(`INSERT INTO session_participants (session_id,student_id,joined_at,left_at,duration_seconds) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (session_id,student_id) DO UPDATE SET joined_at=EXCLUDED.joined_at,left_at=EXCLUDED.left_at,duration_seconds=EXCLUDED.duration_seconds`,[sid,demoUserId,join,leave,item.durationSeconds]);
      if (await tableExists("session_attendance")) await pool.query(`INSERT INTO session_attendance (session_id,student_id,attended,attended_at,status,join_timestamp,leave_timestamp,duration_seconds) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (session_id,student_id) DO UPDATE SET attended=EXCLUDED.attended,attended_at=EXCLUDED.attended_at,status=EXCLUDED.status,join_timestamp=EXCLUDED.join_timestamp,leave_timestamp=EXCLUDED.leave_timestamp,duration_seconds=EXCLUDED.duration_seconds`,[sid,demoUserId,isPresent&&item.title.includes("Present"),isPresent?d:null,isPresent?"Present":"Absent",join,leave,item.durationSeconds]);
    }
  });

  // Shared company/drive -----------------------------------------------------
  let driveId=null,companyId=null;
  await safe("demo company + recruitment drive",async()=>{
    if (!(await tableExists("companies")) || !(await tableExists("recruitment_drives"))) return;
    companyId=(await pool.query(`SELECT id FROM companies WHERE name='Pragati Demo Technologies' LIMIT 1`)).rows[0]?.id;
    if (!companyId) companyId=(await pool.query(`INSERT INTO companies (name,email,industry,size,location,website,description,status,verification_status) VALUES ('Pragati Demo Technologies','company@demo.pragati.local','Software','201-500','Hyderabad','https://example.com','Synthetic company fixture for student-module testing.','approved','approved') RETURNING id`)).rows[0]?.id;
    driveId=(await pool.query(`SELECT id FROM recruitment_drives WHERE title='SM Demo Full-Stack Recruitment Drive' LIMIT 1`)).rows[0]?.id;
    if (!driveId) driveId=(await pool.query(`INSERT INTO recruitment_drives (company_id,title,status,current_stage,min_gpa,required_skills,max_openings,application_deadline,job_title,department,salary_package,work_mode,location,deadline,frozen) VALUES ($1,'SM Demo Full-Stack Recruitment Drive','active','training',7.0,ARRAY['React','Node.js','SQL'],20,NOW()+INTERVAL '14 days','Junior Full Stack Developer','Engineering','8-12 LPA','Hybrid','Hyderabad',NOW()+INTERVAL '14 days',FALSE) RETURNING id`,[companyId])).rows[0]?.id;
    if (demoUserId && await tableExists("drive_enrollments")) await pool.query(`INSERT INTO drive_enrollments (student_id,drive_id) VALUES ($1,$2) ON CONFLICT (student_id,drive_id) DO NOTHING`,[demoUserId,driveId]).catch(()=>undefined);
    if (await tableExists("student_drive_progress")) await pool.query(`INSERT INTO student_drive_progress (student_id,drive_id,college_id,company_id,current_stage,stage,assessment_score,training_completion,stage_updated_at) SELECT $1,$2,NULL,$3,'training','trained',88,76,NOW() WHERE NOT EXISTS (SELECT 1 FROM student_drive_progress WHERE student_id=$1 AND drive_id=$2)`,[demoStudentId,driveId,companyId]).catch(()=>undefined);
  });

  // SM-06 --------------------------------------------------------------------
  await safe("assignment scenarios",async()=>{
    if (!(await tableExists("assignments"))) return;
    const seeds=[
      ["SM-06 Pending Assignment","REST API Validation","pending","both",7],
      ["SM-06 Graded File Assignment","PostgreSQL","graded","file",-3],
      ["SM-06 Late Submission Assignment","React Debugging","late","link",-8],
      ["SM-06 Resubmission Assignment","Node.js API Testing","submitted","both",5],
    ];
    for (const [title,subject,scenario,submissionType,dueOffset] of seeds) {
      let id=(await pool.query(`SELECT id FROM assignments WHERE title=$1 LIMIT 1`,[title])).rows[0]?.id;
      if (!id) id=(await pool.query(`INSERT INTO assignments (student_id,title,subject,description,due_date,total_marks,status,submission_type,grace_days,penalty_per_day,allow_resubmission,max_resubmissions)
        VALUES ($1,$2,$3,$4,CURRENT_DATE + ($5::int),100,$6,$7,$8,$9,TRUE,3) RETURNING id`,[demoStudentId,title,subject,`Synthetic ${scenario} scenario for SM-06 validation.`,dueOffset,scenario==="pending"?"Open":"Closed",submissionType,scenario==="late"?2:0,scenario==="late"?10:0])).rows[0]?.id;
      if (!id || !(await tableExists("assignment_submissions")) || scenario==="pending") continue;
      await pool.query(`INSERT INTO assignment_submissions (assignment_id,student_id,content,file_url,status,submitted_at,submitted_file_name,submitted_file_type,late_days,late_penalty,attempt_number)
        VALUES ($1,$2,$3,$4,$5,NOW(),$6,$7,$8,$9,$10) ON CONFLICT (assignment_id,student_id) DO UPDATE SET content=EXCLUDED.content,file_url=EXCLUDED.file_url,status=EXCLUDED.status,submitted_at=EXCLUDED.submitted_at,late_days=EXCLUDED.late_days,late_penalty=EXCLUDED.late_penalty,attempt_number=EXCLUDED.attempt_number`,[id,demoStudentId,submissionType==="link"?"https://docs.google.com/document/d/demo-assignment":"Completed implementation and notes.",submissionType==="file"||submissionType==="both"?"https://example.com/uploads/demo-assignment.zip":null,scenario==="graded"?"Submitted":scenario==="late"?"Late":"Submitted",submissionType==="file"||submissionType==="both"?"sm06-demo-submission.zip":null,submissionType==="file"||submissionType==="both"?"application/zip":"text/uri-list",scenario==="late"?2:0,scenario==="late"?20:0,scenario==="submitted"?2:1]).catch(()=>undefined);
      if (scenario==="graded" && await tableExists("assignment_feedback")) await pool.query(`INSERT INTO assignment_feedback (assignment_id,student_id,remarks,grade,inline_comments) VALUES ($1,$2,$3,$4,$5::jsonb) ON CONFLICT (assignment_id,student_id) DO UPDATE SET remarks=EXCLUDED.remarks,grade=EXCLUDED.grade,inline_comments=EXCLUDED.inline_comments`,[id,demoStudentId,"Strong API structure. Improve validation edge-case coverage.","82",JSON.stringify([{line:18,comment:"Consider validating an empty payload."}])]).catch(()=>undefined);
      if (scenario==="graded" && await tableExists("assignment_grades")) await pool.query(`INSERT INTO assignment_grades (assignment_id,student_id,score,remarks) VALUES ($1,$2,82,$3) ON CONFLICT (assignment_id,student_id) DO UPDATE SET score=EXCLUDED.score,remarks=EXCLUDED.remarks`,[id,demoStudentId,"Good implementation; add more negative-path tests."]).catch(()=>undefined);
    }
  });

  // SM-07 --------------------------------------------------------------------
  let assessmentIds=[];
  await safe("assessment scenarios",async()=>{
    if (!(await tableExists("assessments")) || !(await tableExists("assessment_questions"))) return;
    for (const [title,difficulty,minutes,marks,attempts,review] of [["SM-07 All Types Demo","Medium",20,40,2,true],["SM-07 Auto Submit Scenario","Easy",10,20,1,false],["SM-07 Expired Scenario","Hard",15,30,1,true],["SM-07 In Progress Scenario","Medium",30,30,1,false]]) {
      let id=(await pool.query(`SELECT id FROM assessments WHERE title=$1 LIMIT 1`,[title])).rows[0]?.id;
      if (!id) id=(await pool.query(`INSERT INTO assessments (title,type,difficulty,time_limit_minutes,total_marks,status,max_attempts,review_enabled,review_available_at,shuffle_questions,shuffle_options,passing_percentage,published_at) VALUES ($1,'MCQ',$2,$3,$4,'active',$5,$6,NOW(),TRUE,TRUE,40,NOW()) RETURNING id`,[title,difficulty,minutes,marks,attempts,review])).rows[0]?.id;
      if (id) assessmentIds.push(id);
    }
    const allId=(await pool.query(`SELECT id FROM assessments WHERE title='SM-07 All Types Demo' LIMIT 1`)).rows[0]?.id;
    if (allId) for (const [type,text,options,correctOption,correctAnswer,explanation] of [
      ["MCQ","Which HTTP method conventionally creates a resource?",["GET","POST","PUT","DELETE"],2,"2","POST creates a new resource in the usual REST convention."],
      ["TRUE_FALSE","Props should be treated as read-only inputs by a React child component.",["True","False"],null,"true","Props flow into a child and should not be mutated by the child."],
      ["FILL_BLANK","The array transformation method is ____.",null,null,JSON.stringify(["map"]),"Array.prototype.map produces a new transformed array."],
      ["MATCH","Match each layer to its responsibility.",{left:["Route","Controller","Service","Model"],right:["Request orchestration","HTTP transport","Business logic","SQL/data access"]},null,JSON.stringify({Route:"Request orchestration",Controller:"HTTP transport",Service:"Business logic",Model:"SQL/data access"}),"Each layer owns a distinct architectural concern."],
    ]) await pool.query(`INSERT INTO assessment_questions (assessment_id,type,question_text,options,correct_option,correct_answer,explanation,marks) SELECT $1,$2,$3,$4::jsonb,$5,$6::jsonb,$7,10 WHERE NOT EXISTS (SELECT 1 FROM assessment_questions WHERE assessment_id=$1 AND question_text=$3)`,[allId,type, text, options==null?null:JSON.stringify(options),correctOption,correctAnswer,explanation]).catch(()=>undefined);
    if (await tableExists("assessment_assignments") && driveId) for (const id of assessmentIds) await pool.query(`INSERT INTO assessment_assignments (assessment_id,drive_id) SELECT $1,$2 WHERE NOT EXISTS (SELECT 1 FROM assessment_assignments WHERE assessment_id=$1 AND drive_id=$2)`,[id,driveId]).catch(()=>undefined);
    if (await tableExists("student_assessment_attempts") && allId) {
      for (const [n,status,score,pct,tabs] of [[1,"submitted",82,82,2],[2,"auto_submitted",67,67,1],[3,"expired",null,null,0]]) {
        const started=new Date(Date.now()-2*86400000),expires=new Date(started.getTime()+20*60000),submitted=status==="expired"?null:new Date(started.getTime()+17*60000);
        await pool.query(`INSERT INTO student_assessment_attempts (assessment_id,student_id,attempt_number,status,started_at,expires_at,submitted_at,score,total_marks,percentage,passed,tab_switch_count) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,40,$9,$10,$11) ON CONFLICT (assessment_id,student_id,attempt_number) DO UPDATE SET status=EXCLUDED.status,submitted_at=EXCLUDED.submitted_at,score=EXCLUDED.score,percentage=EXCLUDED.percentage,passed=EXCLUDED.passed,tab_switch_count=EXCLUDED.tab_switch_count`,[allId,demoStudentId,n,status,started,expires,submitted,score,pct,score==null?null:score>=40,tabs]);
      }
    }
  });

  // SM-08 --------------------------------------------------------------------
  let codingIds=[];
  await safe("coding challenge scenarios",async()=>{
    if (!(await tableExists("assessments")) || !(await tableExists("coding_test_cases"))) return;
    for (const [title,difficulty,minutes] of [["SM-08 Coding Easy - Two Sum","Easy",30],["SM-08 Coding Medium - Sliding Window","Medium",45],["SM-08 Coding Hard - Graph DP","Hard",60]]) {
      let id=(await pool.query(`SELECT id FROM assessments WHERE title=$1 LIMIT 1`,[title])).rows[0]?.id;
      if (!id) id=(await pool.query(`INSERT INTO assessments (title,type,difficulty,time_limit_minutes,total_marks,status,start_at,due_at,published_at,max_attempts,review_enabled,passing_percentage,memory_limit_mb) VALUES ($1,'Coding',$2,$3,100,'active',NOW()-INTERVAL '1 hour',NOW()+INTERVAL '14 days',NOW(),1,FALSE,40,256) RETURNING id`,[title,difficulty,minutes])).rows[0]?.id;
      if (!id) continue; codingIds.push(id);
      for (const [input,output,hidden] of [["[2,7,11,15]\n9","[0,1]",false],["[3,2,4]\n6","[1,2]",false],["[1,5,9,12]\n10","[1,2]",true],["[-4,-1,-7]","-1",true]]) await pool.query(`INSERT INTO coding_test_cases (challenge_id,input,expected_output,is_hidden,weight_pct,time_limit_ms) SELECT $1,$2,$3,$4,25,2000 WHERE NOT EXISTS (SELECT 1 FROM coding_test_cases WHERE challenge_id=$1 AND input=$2)`,[id,input,output,hidden]);
      if (await tableExists("coding_languages")) for (const [lid,name] of [[63,"javascript"],[71,"python"],[62,"java"],[54,"cpp"]]) await pool.query(`INSERT INTO coding_languages (challenge_id,language_id,language_name) SELECT $1,$2,$3 WHERE NOT EXISTS (SELECT 1 FROM coding_languages WHERE challenge_id=$1 AND language_id=$2)`,[id,lid,name]);
    }
    if (demoUserId && await tableExists("challenge_submissions") && codingIds.length) for (const [i,[language,code,score,verdict,passed,total,type,isFinal,solve]] of [[0,[63,"function twoSum(nums,target){return [0,1];}",100,"Accepted",4,4,"final",true,720]],[1,[71,"def solve():\n    return None",50,"Wrong Answer",2,4,"run",false,180]],[2,[62,"class Main { public static void main(String[] a) {} }",25,"Time Limit Exceeded",1,4,"run",false,420]],[3,[54,"#include <bits/stdc++.h>\nint main(){}",0,"Runtime Error",0,4,"run",false,90]]]) { const challengeId=codingIds[i%codingIds.length]; if (isFinal) await pool.query(`DELETE FROM challenge_submissions WHERE student_id=$1 AND challenge_id=$2 AND is_final=TRUE AND submission_type='final'`,[demoUserId,challengeId]).catch(()=>undefined); await pool.query(`INSERT INTO challenge_submissions (student_id,challenge_id,language_id,source_code,total_score,execution_time_ms,judge0_verdict,passed_test_cases,total_test_cases,submission_type,is_final,solve_time_seconds) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,[demoUserId,challengeId,language,code,score,solve,verdict,passed,total,type,isFinal,solve]); }
  });

  // SM-09 --------------------------------------------------------------------
  await safe("project scenarios",async()=>{
    if (!(await tableExists("student_projects"))) return;
    for (const [title,status,days] of [["SM-09 Project - Not Started","NOT_STARTED",14],["SM-09 Project - In Progress","IN_PROGRESS",21],["SM-09 Project - Submitted","SUBMITTED",28],["SM-09 Project - Graded","COMPLETED",35]]) {
      let pid=(await pool.query(`SELECT id FROM student_projects WHERE student_id=$1 AND title=$2 LIMIT 1`,[demoStudentId,title])).rows[0]?.id;
      if (!pid) pid=(await pool.query(`INSERT INTO student_projects (student_id,title,description,objectives,requirements,deliverables,tech_stack,resources,evaluation_criteria,deadline,status,mentor_name,batch_name,duration_weeks) VALUES ($1,$2,$3,$4::jsonb,$5::jsonb,$6::jsonb,$7::jsonb,$8::jsonb,$9::jsonb,NOW()+($10::int)*INTERVAL '1 day',$11,'Training Mentor','Student Demo Batch',6) RETURNING id`,[demoStudentId,title,`Synthetic ${status} project scenario for SM-09 testing.`,JSON.stringify(["Define scope","Implement core feature","Validate deployment"]),JSON.stringify(["React","REST API","Responsive UI"]),JSON.stringify(["GitHub URL","Deployment URL","PDF report"]),JSON.stringify(["React","Node.js","PostgreSQL"]),JSON.stringify([{label:"React docs",url:"https://react.dev"}]),JSON.stringify([{id:"functionality",criterion:"Functionality",maxScore:40,weight:40},{id:"quality",criterion:"Code Quality",maxScore:30,weight:30},{id:"documentation",criterion:"Documentation",maxScore:30,weight:30}]),days,status])).rows[0]?.id;
      if (!pid) continue;
      if (await tableExists("project_milestones")) for (const [i,[mstatus,progress,offset]] of [["COMPLETED",100,7],[status==="NOT_STARTED"?"PENDING":"IN_PROGRESS",status==="NOT_STARTED"?0:65,14],[status==="COMPLETED"?"COMPLETED":"PENDING",status==="COMPLETED"?100:0,21],[status==="SUBMITTED"||status==="COMPLETED"?"SUBMITTED":"PENDING",status==="SUBMITTED"||status==="COMPLETED"?100:0,28]].entries()) await pool.query(`INSERT INTO project_milestones (project_id,title,description,deadline,status,progress,milestone_order) VALUES ($1,$2,$3,NOW()+($4::int)*INTERVAL '1 day',$5,$6,$7) ON CONFLICT (project_id,milestone_order) DO UPDATE SET status=EXCLUDED.status,progress=EXCLUDED.progress,deadline=EXCLUDED.deadline`,[pid,["Planning","Core Development","Testing & Review","Final Submission"][i],`Synthetic milestone ${i+1} for ${status}.`,offset,mstatus,progress,i+1]);
      if ((status==="SUBMITTED"||status==="COMPLETED") && await tableExists("project_submissions")) await pool.query(`INSERT INTO project_submissions (project_id,student_id,version,github_url,deployment_url,description,documentation,report_url,additional_comments,status,feedback,report_mime_type,report_size_bytes) VALUES ($1,$2,1,'https://github.com/pragati-demo/student-project','https://demo-project.example.com','Final submission fixture','README and deployment notes','https://example.com/reports/project-report.pdf','Ready for mentor review',$3,$4,'application/pdf',245760) ON CONFLICT (project_id,version) DO UPDATE SET status=EXCLUDED.status,feedback=EXCLUDED.feedback`,[pid,demoStudentId,status==="COMPLETED"?"APPROVED":"SUBMITTED",status==="COMPLETED"?"Strong submission. Add broader automated test coverage.":null]).catch(()=>undefined);
      if (status==="COMPLETED" && await tableExists("project_evaluations")) await pool.query(`INSERT INTO project_evaluations (project_id,score,status,criteria,strengths,improvements,feedback) VALUES ($1,88,'EVALUATED',$2::jsonb,$3::jsonb,$4::jsonb,$5) ON CONFLICT (project_id) DO UPDATE SET score=EXCLUDED.score,status=EXCLUDED.status,criteria=EXCLUDED.criteria,strengths=EXCLUDED.strengths,improvements=EXCLUDED.improvements,feedback=EXCLUDED.feedback,evaluated_at=NOW()`,[pid,JSON.stringify([{criterion:"Functionality",score:36},{criterion:"Code Quality",score:26},{criterion:"Documentation",score:26}]),JSON.stringify(["Clean UI","Good service separation"]),JSON.stringify(["Add integration tests","Document error cases"]),"Very good capstone. Prioritize testing depth next."]).catch(()=>undefined);
    }
    if (await tableExists("project_milestone_submissions")) { const ms=(await pool.query(`SELECT p.id project_id,m.id milestone_id FROM student_projects p JOIN project_milestones m ON m.project_id=p.id WHERE p.student_id=$1 AND p.title='SM-09 Project - In Progress' ORDER BY m.milestone_order LIMIT 2`,[demoStudentId])).rows; for (const m of ms) await pool.query(`INSERT INTO project_milestone_submissions (project_id,milestone_id,student_id,github_url,deployed_url,progress_notes,status,feedback) VALUES ($1,$2,$3,'https://github.com/pragati-demo/student-project','https://demo-project.example.com',$4,'SUBMITTED',$5) ON CONFLICT (student_id,milestone_id) DO UPDATE SET progress_notes=EXCLUDED.progress_notes,feedback=EXCLUDED.feedback,status=EXCLUDED.status,updated_at=NOW()`,[m.project_id,m.milestone_id,demoStudentId,"Implemented the current milestone and documented blockers.","Looks good. Continue with the next checkpoint."]).catch(()=>undefined); } 
  });

  // SM-10 --------------------------------------------------------------------
  await safe("performance analytics source data",async()=>{
    if (!(await tableExists("activity_submissions"))) return;
    const activityData=[["JS Fundamentals Quiz","quiz",82],["REST API Assignment","assignment",74],["Two Sum Coding Challenge","coding",68],["Placement Case Study","casestudy",79],["Capstone Project","project",88]];
    for (let i=0;i<activityData.length;i++) { const [title,type,score]=activityData[i]; await pool.query(`INSERT INTO activity_submissions (student_id,drive_id,activity_title,activity_type,status,score,submitted_at) SELECT $1,$2,$3,$4,'graded',$5,NOW()-(($6::int)*INTERVAL '1 day') WHERE NOT EXISTS (SELECT 1 FROM activity_submissions WHERE student_id=$1 AND activity_title=$3)`,[demoUserId||demoStudentId,driveId,title,type,score,i+2]).catch(()=>undefined); }
  });

  // SM-11 --------------------------------------------------------------------
  await safe("interview scenarios",async()=>{
    if (!(await tableExists("interviews"))) return;
    const columns=new Set((await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='interviews'`)).rows.map(r=>r.column_name));
    const addInterview=async(label,status,days,outcome)=>{
      if (!columns.has("student_id")) return;
      const fields=["student_id"],vals=[demoStudentId],ph=["$1"];
      const put=(c,v)=>{if (!columns.has(c)) return; fields.push(c); vals.push(v); ph.push(`$${vals.length}`);};
      put("drive_id",driveId); put("title",`SM-11 ${label}`); put("company_name","Pragati Demo Technologies"); put("scheduled_at",new Date(Date.now()+days*86400000).toISOString()); put("format","video"); put("status",status); put("interview_type","TECHNICAL"); put("meeting_link","https://meet.example.com/pragati-demo-interview"); put("join_url","https://meet.example.com/pragati-demo-interview"); put("outcome",outcome);
      await pool.query(`INSERT INTO interviews (${fields.join(",")}) VALUES (${ph.join(",")})`,vals).catch(()=>undefined);
    };
    await addInterview("Invited Scenario","INVITED",2,null); await addInterview("Confirmed Scenario","CONFIRMED",4,null); await addInterview("Selected Outcome Scenario","COMPLETED",-5,"SELECTED"); await addInterview("Rejected Outcome Scenario","COMPLETED",-3,"REJECTED"); await addInterview("Waitlisted Outcome Scenario","COMPLETED",-2,"WAITLISTED");
  });

  // Placement companion data. Explicit casts remove PostgreSQL's ambiguity when
  // these parameters appear in both INSERT and WHERE clauses on older schemas.
  await safe("placement intelligence scenarios",async()=>{
    if (!(await tableExists("job_applications"))) return;
    const apps=[["TechCorp","Junior Full Stack Developer","SHORTLISTED"],["InnovateX","Backend Engineer Intern","APPLIED"],["DataWorks","Software Engineer","REJECTED"],["CloudNine","Frontend Engineer","SELECTED"]];
    for (const [company,title,status] of apps) await pool.query(`INSERT INTO job_applications (student_id,company_name,job_title,job_id,status,applied_date,notes,history)
      SELECT $1,$2::varchar,$3::varchar,$4::varchar,$5::varchar,NOW()-INTERVAL '5 days',$6::text,jsonb_build_array(jsonb_build_object('status',$5::varchar,'changedAt',NOW()::text))
      WHERE NOT EXISTS (SELECT 1 FROM job_applications WHERE student_id=$1 AND company_name=$2::varchar AND job_title=$3::varchar)`,[demoStudentId,company,title,`${company.toUpperCase().slice(0,4)}-DEMO-01`,status,`SM-11/placement ${status.toLowerCase()} scenario.`]);
    if (await tableExists("placement_interviews")) { const rows=(await pool.query(`SELECT id,company_name,job_title FROM job_applications WHERE student_id=$1 ORDER BY id LIMIT 3`,[demoStudentId])).rows; for (const [i,a] of rows.entries()) await pool.query(`INSERT INTO placement_interviews (student_id,application_id,company_name,job_title,date_time,location,type,status,feedback,score)
      SELECT $1,$2,$3::varchar,$4::varchar,NOW()+(($5::int)*INTERVAL '1 day'),$6::varchar,$7::varchar,$8::varchar,$9::text,$10::int
      WHERE NOT EXISTS (SELECT 1 FROM placement_interviews WHERE student_id=$1 AND application_id=$2)`,[demoStudentId,a.id,a.company_name,a.job_title,i-1,i===2?"Office - Hyderabad":"Online",["TECHNICAL","HR","MANAGERIAL"][i],i===2?"COMPLETED":"SCHEDULED",i===2?"Good communication and structured thinking.":null,i===2?86:null]); }
  });

  // SM-12 --------------------------------------------------------------------
  await safe("notification scenarios",async()=>{
    if (!(await tableExists("notifications")) || !demoUserId) return;
    const data=[
      ["grade_released","Assignment Graded","Your REST API assignment scored 82/100.","success",false],
      ["session_scheduled","New live session scheduled","A mentor session starts tomorrow.","info",false],
      ["assignment_published","New assignment","A new React debugging assignment is available.","info",true],
      ["shortlisted","You were shortlisted","TechCorp moved your application to shortlisted.","success",false],
      ["interview_invited","Interview invitation","Your technical interview invitation is ready.","info",false],
      ["interview_outcome","Interview outcome","Your interview outcome has been published.","success",true],
      ["platform_announcement","Platform announcement","Pragati will be unavailable for maintenance this weekend.","warning",true],
      ["certificate_issued","Certificate issued","Congratulations — your Pragati certificate is ready.","success",false],
    ];
    for (let i=0;i<data.length;i++){const [key,title,msg,type,read]=data[i]; await pool.query(`INSERT INTO notifications (student_auth_user_id,user_id,title,message,type,link_url,is_read,created_at) SELECT NULL,$1,$2,$3,$4,$5,$6,NOW()-(($7::int)*INTERVAL '1 hour') WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE user_id=$1 AND title=$2)`,[demoUserId,title,msg,type,`/student/${key}`,read,i+1]).catch(()=>undefined);}
    if (await tableExists("notification_preferences")) for (const [key] of data) await pool.query(`INSERT INTO notification_preferences (student_id,notification_type,in_app,email,push) VALUES ($1,$2,TRUE,TRUE,TRUE) ON CONFLICT (student_id,notification_type) DO UPDATE SET in_app=TRUE,email=TRUE,push=TRUE,updated_at=NOW()`,[demoStudentId,key]).catch(()=>undefined);
    if (await tableExists("student_notification_preferences")) await pool.query(`INSERT INTO student_notification_preferences (student_id,in_app,email,push,assignment_reminders,assessment_reminders,interview_updates,session_reminders,weekly_digest) VALUES ($1,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE) ON CONFLICT (student_id) DO UPDATE SET in_app=TRUE,email=TRUE,push=TRUE,assignment_reminders=TRUE,assessment_reminders=TRUE,interview_updates=TRUE,session_reminders=TRUE,weekly_digest=TRUE,updated_at=NOW()`,[demoStudentId]).catch(()=>undefined);
  });

  // SM-13 --------------------------------------------------------------------
  await safe("certificate scenarios",async()=>{
    if (!(await tableExists("certificates")) || !demoUserId || !driveId) return;
    await pool.query(`INSERT INTO certificates (student_id,drive_id,certificate_url,score,issued_at,revoked) SELECT $1,$2,'https://example.com/certificates/pragati-demo-earned.pdf',88.5,NOW()-INTERVAL '10 days',FALSE WHERE NOT EXISTS (SELECT 1 FROM certificates WHERE student_id=$1 AND drive_id=$2)`,[demoUserId,driveId]).catch(()=>undefined);
    let revokedDrive=(await pool.query(`SELECT id FROM recruitment_drives WHERE title='SM Demo Completed Drive' LIMIT 1`)).rows[0]?.id;
    if (!revokedDrive && companyId) revokedDrive=(await pool.query(`INSERT INTO recruitment_drives (company_id,title,status,current_stage,max_openings,deadline) VALUES ($1,'SM Demo Completed Drive','completed','selection',10,NOW()-INTERVAL '5 days') RETURNING id`,[companyId])).rows[0]?.id;
    if (revokedDrive) await pool.query(`INSERT INTO certificates (student_id,drive_id,certificate_url,score,issued_at,revoked,revoked_at) SELECT $1,$2,'https://example.com/certificates/pragati-demo-revoked.pdf',62,NOW()-INTERVAL '30 days',TRUE,NOW()-INTERVAL '4 days' WHERE NOT EXISTS (SELECT 1 FROM certificates WHERE student_id=$1 AND drive_id=$2)`,[demoUserId,revokedDrive]).catch(()=>undefined);
  });

  const count=async(label,sql,params=[])=>{const r=await safe(`count ${label}`,()=>pool.query(sql,params));return r?.rows?.[0]?.count??0;};
  const weekly=await count("weekly sessions",`SELECT COUNT(*)::int count FROM live_sessions WHERE title LIKE 'SM-05 Weekly QA Session %'`);
  const assignments=await count("assignments",`SELECT COUNT(*)::int count FROM assignments WHERE title LIKE 'SM-06 %'`);
  const assessments=await count("assessments",`SELECT COUNT(*)::int count FROM assessments WHERE title LIKE 'SM-07 %'`);
  const coding=await count("coding challenges",`SELECT COUNT(*)::int count FROM assessments WHERE title LIKE 'SM-08 %'`);
  const projects=await count("projects",`SELECT COUNT(*)::int count FROM student_projects WHERE student_id=$1 AND title LIKE 'SM-09 %'`,[demoStudentId]);
  const notifications=await count("notifications",`SELECT COUNT(*)::int count FROM notifications WHERE user_id=$1 AND (title LIKE '%assignment%' OR title LIKE '%session%' OR title LIKE '%Interview%' OR title LIKE '%Certificate%' OR title LIKE '%shortlisted%' OR title LIKE '%announcement%' OR title LIKE '%Graded%')`,[demoUserId||demoStudentId]);

  console.log("\n✅ Student Demo seed completed");
  console.log(`   Primary student: ${demoStudent.name} / ${demoStudent.email}`);
  console.log(`   Weekly SM-05 sessions: ${weekly} (expected 7 × 24 hours)`);
  console.log(`   SM-06 assignment scenarios: ${assignments}`);
  console.log(`   SM-07 assessment scenarios: ${assessments}`);
  console.log(`   SM-08 coding challenge scenarios: ${coding}`);
  console.log(`   SM-09 project scenarios: ${projects}`);
  console.log(`   SM-12 notifications: ${notifications}`);
  console.log(`   Demo recording: ${WATCH_URL}`);
  console.log("   Note: SM-01 Firebase login/refresh still requires a real Firebase-authenticated browser session; persistent student/onboarding state is seeded.");
};

try { await seed(); }
catch (error) { console.error("[seedStudentDemoData] Failed:",error.message); process.exitCode=1; }
finally { await pool.end(); }
