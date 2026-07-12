<<<<<<< HEAD
pragati
=======
# Coding Challenges Backend

This project is a backend module for a coding challenges platform built using Node.js, Express.js, and PostgreSQL. It provides a set of APIs for managing coding challenges, submissions, test cases, execution results, and leaderboards.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Pragati-Uptoskills/Pragati.git
   cd Pragati/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the PostgreSQL database and update the configuration in `src/config/db.js`.

4. Run database migrations and seed data:
   ```
   npm run migrate
   npm run seed
   ```

5. Start the server:
   ```
   npm start
   ```

## Usage

The backend provides RESTful APIs for the frontend to interact with. You can use tools like Postman to test the endpoints.

## API Endpoints

- **Coding Challenges**
  - `GET /api/student/coding-challenges` - Retrieve all coding challenges
  - `GET /api/student/coding-challenges/:id` - Retrieve a specific coding challenge by ID

- **Submissions**
  - `POST /api/student/coding-challenges/:id/submit` - Submit a solution for a coding challenge
  - `GET /api/student/coding-challenges/submissions` - Retrieve submission history
  - `GET /api/student/coding-challenges/submissions/:id` - Retrieve a specific submission by ID

- **Execution**
  - `POST /api/student/coding-challenges/:id/run` - Execute code for a coding challenge
  - `GET /api/student/coding-challenges/:id/execution-results` - Retrieve execution results

- **Test Cases**
  - `GET /api/student/coding-challenges/:id/testcases` - Retrieve test cases for a coding challenge
  - `GET /api/student/coding-challenges/:id/testcases/hidden` - Retrieve hidden test cases

- **Leaderboard**
  - `GET /api/student/coding-challenges/leaderboard` - Retrieve leaderboard information
  - `PATCH /api/student/coding-challenges/leaderboard` - Update leaderboard information

## Database Schema

The database consists of the following tables:
- `coding_challenges`
- `challenge_submissions`
- `test_cases`
- `execution_results`
- `challenge_leaderboard`

## Contributing

Contributions are welcome! Please follow the standard Git workflow for submitting pull requests.

## License

This project is licensed under the MIT License.
>>>>>>> 61c0bb6dbe72babebc1782d25c04b31425c871d4
