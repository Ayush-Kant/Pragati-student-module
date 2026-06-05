CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    
    gender VARCHAR(20),
    date_of_birth DATE,
    
    college VARCHAR(255),
    branch VARCHAR(100),
    graduation_year INT,
    
    skills TEXT[],
    
    linkedin_url TEXT,
    github_url TEXT,
    resume_url TEXT,
    profile_image TEXT,
    
    bio TEXT,
    
    profile_completeness INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
