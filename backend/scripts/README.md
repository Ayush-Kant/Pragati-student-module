# Scripts Directory

One-time utility scripts used during development. These are **not part of the application runtime** and should never be imported by server code.

## Contents

| File | Purpose |
|---|---|
| `fix_students.js` | One-time fix for student records |
| `patch_companies.js` | One-time patch for company data |
| `patch_courses.js` | One-time patch for course data |
| `insert_test_data.js` | Manual test data insertion |
| `test_departments.js` | Department API smoke test |
| `verify_files.js` | File structure verification |
| `verify_schema.js` | DB schema verification |
| `check_cycles.js` | Circular dependency checker |
| `seed-frontend.js` | Frontend development seed data |
| `seed_students.js` | Student seed data |

## Usage

```bash
# Run from backend root
node scripts/<filename>.js
```

> ⚠️ Always review these scripts before running against a production database.
