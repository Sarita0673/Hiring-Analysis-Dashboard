-- Internship & Fresher Hiring Analysis
-- Run in MySQL Workbench. Load the cleaned CSV into job_listings after creating the table.
CREATE DATABASE IF NOT EXISTS internship_hiring;
USE internship_hiring;

CREATE TABLE IF NOT EXISTS job_listings (
    job_id VARCHAR(50),
    role VARCHAR(150),
    company VARCHAR(150),
    skills TEXT,
    internship_duration VARCHAR(100),
    stipend VARCHAR(100),
    work_mode VARCHAR(50),
    location VARCHAR(150),
    technology VARCHAR(150),
    experience VARCHAR(100),
    industry VARCHAR(150),
    source VARCHAR(500),
    date_collected DATE
);

-- 1. Check number of rows
SELECT COUNT(*) AS total_listings FROM job_listings;

-- 2. Most common roles
SELECT role, COUNT(*) AS total_listings
FROM job_listings
WHERE role IS NOT NULL AND role <> ''
GROUP BY role
ORDER BY total_listings DESC;

-- 3. Work mode distribution
SELECT work_mode, COUNT(*) AS total_listings
FROM job_listings
GROUP BY work_mode
ORDER BY total_listings DESC;

-- 4. Top locations
SELECT location, COUNT(*) AS total_listings
FROM job_listings
WHERE location IS NOT NULL AND location <> ''
GROUP BY location
ORDER BY total_listings DESC
LIMIT 10;

-- 5. Most frequently listed technology (one technology value per row)
SELECT technology, COUNT(*) AS total_listings
FROM job_listings
WHERE technology IS NOT NULL AND technology <> ''
GROUP BY technology
ORDER BY total_listings DESC
LIMIT 10;

-- 6. Stipend field availability (text values are not assumed to be numeric)
SELECT
  CASE
    WHEN stipend IS NULL OR LOWER(TRIM(stipend)) IN ('', 'not mentioned', 'not disclosed')
      THEN 'Not mentioned'
    ELSE 'Mentioned'
  END AS stipend_status,
  COUNT(*) AS total_listings
FROM job_listings
GROUP BY stipend_status;

-- 7. Listings by industry
SELECT industry, COUNT(*) AS total_listings
FROM job_listings
GROUP BY industry
ORDER BY total_listings DESC;

-- Note: Skills are stored as comma-separated text for this beginner version.
-- Python analysis splits the Skills field to count individual skills more reliably.
